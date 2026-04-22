import admin from 'firebase-admin';

function getAdminApp() {
  if (admin.apps.length) return admin.app();
  console.log('central-staff-create env check', {
  vercelEnv: process.env.VERCEL_ENV,
  hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
  hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
  hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
});
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('missing-admin-env');
  }
  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

function send(res, status, payload) {
  res.status(status).json(payload);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'method-not-allowed' });
  try {
    const app = getAdminApp();
    const auth = admin.auth(app);
    const db = admin.firestore(app);

    const authorization = req.headers.authorization || '';
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return send(res, 401, { ok: false, error: 'not-authenticated' });

    const decoded = await auth.verifyIdToken(match[1]);
    const callerSnap = await db.collection('users').doc(decoded.uid).get();
    const callerData = callerSnap.exists ? callerSnap.data() || {} : {};
    const callerRole = String(callerData.role || '').toLowerCase();
    const callerStatus = String(callerData.status || 'active').toLowerCase();
    if (!callerSnap.exists || callerRole !== 'admin' || callerStatus !== 'active') {
      return send(res, 403, { ok: false, error: 'permission-denied' });
    }

    const { email, password, displayName, centralDoc, staffDocId, staffDoc } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '');
    const safeDisplayName = String(displayName || '').trim();
    const safeStaffDocId = String(staffDocId || '').trim();
    if (!normalizedEmail || !normalizedPassword || normalizedPassword.length < 6 || !safeStaffDocId) {
      return send(res, 400, { ok: false, error: 'invalid-payload' });
    }

    let userRecord = null;
    try {
      userRecord = await auth.createUser({
        email: normalizedEmail,
        password: normalizedPassword,
        displayName: safeDisplayName || undefined,
        disabled: false,
      });

      const uid = userRecord.uid;
      const now = new Date().toISOString();
      const finalCentralDoc = {
        ...(centralDoc && typeof centralDoc === 'object' ? centralDoc : {}),
        email: normalizedEmail,
        displayName: safeDisplayName || centralDoc?.displayName || centralDoc?.name || normalizedEmail.split('@')[0],
        name: safeDisplayName || centralDoc?.name || centralDoc?.displayName || normalizedEmail.split('@')[0],
        updatedAt: now,
        lastSyncedAt: now,
        source: 'VERCEL_API_CENTRAL',
      };
      const finalStaffDoc = {
        ...(staffDoc && typeof staffDoc === 'object' ? staffDoc : {}),
        id: safeStaffDocId,
        uid,
        email: normalizedEmail,
        name: safeDisplayName || staffDoc?.name || normalizedEmail.split('@')[0],
        updatedAt: now,
        lastSyncedAt: now,
        source: 'VERCEL_API_CENTRAL',
      };

      await db.collection('users').doc(uid).set(finalCentralDoc, { merge: true });
      await db.collection('staff').doc(safeStaffDocId).set(finalStaffDoc, { merge: true });

      return send(res, 200, { ok: true, uid });
    } catch (error) {
      if (userRecord?.uid) {
        try { await auth.deleteUser(userRecord.uid); } catch {}
      }
      throw error;
    }
  } catch (error) {
    console.error('central-staff-create error', error);
    const message = String(error?.code || error?.message || 'unknown-error');
    if (message.includes('email-already-exists') || message.includes('email-already-in-use')) {
      return send(res, 409, { ok: false, error: 'email-already-in-use' });
    }
    if (message.includes('permission-denied')) {
      return send(res, 403, { ok: false, error: 'permission-denied' });
    }
    if (message.includes('auth/id-token-expired') || message.includes('auth/argument-error')) {
      return send(res, 401, { ok: false, error: 'not-authenticated' });
    }
    if (message.includes('missing-admin-env')) {
      return send(res, 500, { ok: false, error: 'missing-admin-env' });
    }
    return send(res, 500, { ok: false, error: message });
  }
}

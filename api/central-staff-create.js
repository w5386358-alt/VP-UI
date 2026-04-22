const admin = require('firebase-admin');

function getAdminApp() {
  if (admin.apps.length) return admin.app();
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('missing-firebase-admin-env');
  }
  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method-not-allowed' });
  }

  try {
    const { email, password, displayName, centralDoc, staffDoc } = req.body || {};
    const safeEmail = String(email || '').trim().toLowerCase();
    const safePassword = String(password || '');
    const safeDisplayName = String(displayName || '').trim();

    if (!safeEmail || !safePassword) {
      return res.status(400).json({ ok: false, error: 'missing-email-or-password' });
    }
    if (safePassword.length < 6) {
      return res.status(400).json({ ok: false, error: 'weak-password' });
    }

    const app = getAdminApp();
    const auth = app.auth();
    const db = app.firestore();

    let userRecord;
    try {
      userRecord = await auth.createUser({
        email: safeEmail,
        password: safePassword,
        displayName: safeDisplayName || undefined,
      });
    } catch (error) {
      const code = String(error?.code || error?.message || 'auth-create-failed');
      return res.status(400).json({ ok: false, error: code });
    }

    const uid = userRecord.uid;
    const userDoc = { ...(centralDoc || {}), uid, id: uid, email: safeEmail, displayName: safeDisplayName || centralDoc?.displayName || '' };
    const nextStaffDoc = { ...(staffDoc || {}), uid, id: uid, email: safeEmail, name: staffDoc?.name || safeDisplayName || '' };

    try {
      const batch = db.batch();
      batch.set(db.collection('users').doc(uid), userDoc, { merge: true });
      batch.set(db.collection('staff').doc(String(nextStaffDoc.loginId || uid)), nextStaffDoc, { merge: true });
      await batch.commit();
      return res.status(200).json({ ok: true, uid });
    } catch (error) {
      await auth.deleteUser(uid).catch(() => {});
      return res.status(500).json({ ok: false, error: String(error?.code || error?.message || 'firestore-write-failed') });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, error: String(error?.message || 'unknown-error') });
  }
};

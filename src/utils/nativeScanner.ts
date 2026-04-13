type ScanOptions = {
  title?: string;
  formats?: string[];
  fallbackLabel?: string;
};

function promptManual(title: string, fallbackLabel: string) {
  const manual = window.prompt(`${title}
請輸入${fallbackLabel}：`, '');
  return manual ? manual.trim() : null;
}

async function detectFromImage(file: File | Blob, formats?: string[]) {
  const DetectorCtor = (window as any).BarcodeDetector;
  if (!DetectorCtor) return null;
  const detector = new DetectorCtor({
    formats: formats || ['qr_code', 'code_128', 'ean_13', 'ean_8', 'code_39', 'upc_a', 'upc_e'],
  });
  const bitmap = await createImageBitmap(file);
  const codes = await detector.detect(bitmap);
  return codes?.[0]?.rawValue ? String(codes[0].rawValue) : null;
}

export async function scanWithCamera(options?: ScanOptions): Promise<string | null> {
  const title = options?.title || '啟動掃碼';
  const fallbackLabel = options?.fallbackLabel || '掃碼結果';

  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed','inset:0','background:rgba(18,22,32,.62)','z-index:99999',
      'display:flex','align-items:flex-start','justify-content:center',
      'padding:calc(12px + env(safe-area-inset-top, 0px)) 12px calc(104px + env(safe-area-inset-bottom, 0px))'
    ].join(';');

    const card = document.createElement('div');
    card.style.cssText = [
      'width:min(92vw,420px)','max-height:min(78dvh,760px)','overflow:auto',
      'background:#fff','border-radius:24px','padding:18px',
      'box-shadow:0 24px 70px rgba(0,0,0,.26)','display:grid','gap:12px'
    ].join(';');

    const header = document.createElement('div');
    header.innerHTML = `<div style="font-size:18px;font-weight:800;color:#a21239;">${title}</div><div style="margin-top:6px;color:#6c7280;font-size:13px;line-height:1.6;">優先嘗試相機掃描，若裝置不支援可改用拍照或圖片辨識。</div>`;

    const videoWrap = document.createElement('div');
    videoWrap.style.cssText = 'position:relative;border-radius:20px;overflow:hidden;background:#111;min-height:240px;display:flex;align-items:center;justify-content:center;';
    const video = document.createElement('video');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('autoplay', 'true');
    video.muted = true;
    video.style.cssText = 'width:100%;height:100%;min-height:240px;object-fit:cover;display:block;background:#111;';
    const hint = document.createElement('div');
    hint.textContent = '正在啟動相機…';
    hint.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);color:#fff;font-weight:700;background:rgba(0,0,0,.35);padding:8px 12px;border-radius:999px;font-size:13px;';
    videoWrap.append(video, hint);

    const actions = document.createElement('div');
    actions.style.cssText = 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;';

    function makeBtn(label: string, primary=false) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.style.cssText = [
        'border:none','border-radius:16px','padding:12px 14px','font:inherit','font-weight:800',
        primary ? 'background:linear-gradient(135deg,#a21239,#c03d61);color:#fff;' : 'background:#f6f2f4;color:#4d5663;'
      ].join(';');
      return btn;
    }

    const captureBtn = makeBtn('拍照辨識', true);
    const uploadBtn = makeBtn('改用圖片');
    const manualBtn = makeBtn('手動輸入');
    const cancelBtn = makeBtn('取消');
    actions.append(captureBtn, uploadBtn, manualBtn, cancelBtn);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    card.append(header, videoWrap, actions, fileInput);
    overlay.append(card);
    document.body.appendChild(overlay);

    let stream: MediaStream | null = null;
    let rafId = 0;
    let ended = false;

    const cleanup = () => {
      if (ended) return;
      ended = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) stream.getTracks().forEach((track) => track.stop());
      overlay.remove();
    };

    const finish = (value: string | null) => {
      cleanup();
      resolve(value);
    };

    const scanLive = async () => {
      try {
        const DetectorCtor = (window as any).BarcodeDetector;
        if (!DetectorCtor) {
          hint.textContent = '已啟動相機，可點拍照辨識';
          return;
        }
        const detector = new DetectorCtor({
          formats: options?.formats || ['qr_code', 'code_128', 'ean_13', 'ean_8', 'code_39', 'upc_a', 'upc_e'],
        });
        hint.textContent = '請將條碼 / QR 對準畫面';

        const loop = async () => {
          if (ended) return;
          try {
            if (video.readyState >= 2) {
              const codes = await detector.detect(video);
              const raw = codes?.[0]?.rawValue;
              if (raw) {
                finish(String(raw));
                return;
              }
            }
          } catch {}
          rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);
      } catch {
        hint.textContent = '已啟動相機，可點拍照辨識';
      }
    };

    const captureCurrentFrame = async () => {
      try {
        if (video.readyState < 2) {
          hint.textContent = '相機尚未準備好';
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('canvas unavailable');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, 'image/jpeg', 0.92));
        if (!blob) throw new Error('capture failed');
        const raw = await detectFromImage(blob, options?.formats);
        if (raw) finish(raw);
        else {
          const manual = promptManual(title + '\n未能自動辨識', fallbackLabel);
          finish(manual);
        }
      } catch {
        const manual = promptManual(title + '\n拍照辨識失敗', fallbackLabel);
        finish(manual);
      }
    };

    captureBtn.onclick = captureCurrentFrame;
    uploadBtn.onclick = () => fileInput.click();
    manualBtn.onclick = () => finish(promptManual(title, fallbackLabel));
    cancelBtn.onclick = () => finish(null);
    overlay.onclick = (event) => { if (event.target === overlay) finish(null); };

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      try {
        const raw = await detectFromImage(file, options?.formats);
        if (raw) finish(raw);
        else finish(promptManual(title + '\n未能自動辨識', fallbackLabel));
      } catch {
        finish(promptManual(title + '\n圖片辨識失敗', fallbackLabel));
      }
    };

    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('mediaDevices unavailable');
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        video.srcObject = stream;
        await video.play().catch(() => {});
        await scanLive();
      } catch {
        hint.textContent = '裝置未提供即時相機，請改用拍照或圖片';
      }
    })();
  });
}

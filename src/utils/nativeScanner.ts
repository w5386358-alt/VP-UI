export async function scanWithCamera(options?: {
  title?: string;
  formats?: string[];
  fallbackLabel?: string;
}): Promise<string | null> {
  const title = options?.title || '啟動掃碼';
  const fallbackLabel = options?.fallbackLabel || '掃碼結果';
  const formats = options?.formats || ['qr_code', 'code_128', 'ean_13', 'ean_8', 'code_39', 'upc_a', 'upc_e'];

  const DetectorCtor = (window as any).BarcodeDetector;
  const hasLiveCamera = !!(navigator.mediaDevices?.getUserMedia && DetectorCtor);

  if (hasLiveCamera) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'scanner-live-overlay';
      overlay.innerHTML = `
        <div class="scanner-live-panel">
          <div class="scanner-live-head">
            <strong>${title}</strong>
            <button type="button" class="scanner-live-close" aria-label="關閉">✕</button>
          </div>
          <div class="scanner-live-view">
            <video playsinline autoplay muted></video>
            <div class="scanner-live-frame"></div>
          </div>
          <div class="scanner-live-tip">請將條碼或 QR Code 對準框內</div>
          <div class="scanner-live-actions">
            <button type="button" class="scanner-live-secondary">改用照片</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);

      const video = overlay.querySelector('video') as HTMLVideoElement | null;
      const closeBtn = overlay.querySelector('.scanner-live-close') as HTMLButtonElement | null;
      const photoBtn = overlay.querySelector('.scanner-live-secondary') as HTMLButtonElement | null;
      let stopped = false;
      let stream: MediaStream | null = null;
      let rafId = 0;

      const cleanup = () => {
        stopped = true;
        if (rafId) cancelAnimationFrame(rafId);
        stream?.getTracks().forEach((track) => track.stop());
        overlay.remove();
      };

      const fallbackPhoto = async () => {
        cleanup();
        const value = await scanFromImageFile(title, fallbackLabel, formats);
        resolve(value);
      };

      closeBtn?.addEventListener('click', () => {
        cleanup();
        resolve(null);
      });
      photoBtn?.addEventListener('click', () => { void fallbackPhoto(); });
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          cleanup();
          resolve(null);
        }
      });

      (async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false,
          });
          if (!video) {
            cleanup();
            resolve(null);
            return;
          }
          video.srcObject = stream;
          await video.play();
          const detector = new DetectorCtor({ formats });

          const tick = async () => {
            if (stopped || !video) return;
            try {
              const codes = await detector.detect(video);
              const raw = codes?.[0]?.rawValue;
              if (raw) {
                cleanup();
                resolve(String(raw));
                return;
              }
            } catch (_error) {}
            rafId = requestAnimationFrame(() => { void tick(); });
          };
          void tick();
        } catch (_error) {
          cleanup();
          const value = await scanFromImageFile(title, fallbackLabel, formats);
          resolve(value);
        }
      })();
    });
  }

  return scanFromImageFile(title, fallbackLabel, formats);
}

async function scanFromImageFile(title: string, fallbackLabel: string, formats: string[]): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.setAttribute('capture', 'environment');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.style.pointerEvents = 'none';
    input.style.left = '-9999px';
    document.body.appendChild(input);

    const cleanup = () => {
      window.setTimeout(() => input.remove(), 80);
    };

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        cleanup();
        resolve(null);
        return;
      }
      try {
        const DetectorCtor = (window as any).BarcodeDetector;
        if (DetectorCtor) {
          const detector = new DetectorCtor({ formats });
          const bitmap = await createImageBitmap(file);
          const codes = await detector.detect(bitmap);
          const raw = codes?.[0]?.rawValue;
          cleanup();
          if (raw) {
            resolve(String(raw));
            return;
          }
        }
        cleanup();
        const manual = window.prompt(`${title}\n未能自動辨識，請手動輸入${fallbackLabel}：`, '');
        resolve(manual ? manual.trim() : null);
      } catch (_error) {
        cleanup();
        const manual = window.prompt(`${title}\n裝置不支援自動辨識，請手動輸入${fallbackLabel}：`, '');
        resolve(manual ? manual.trim() : null);
      }
    };

    input.click();
  });
}

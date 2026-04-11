export async function scanWithCamera(options?: {
  title?: string;
  formats?: string[];
  fallbackLabel?: string;
}): Promise<string | null> {
  const title = options?.title || '啟動掃碼';
  const fallbackLabel = options?.fallbackLabel || '掃碼結果';

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
          const detector = new DetectorCtor({
            formats: options?.formats || ['qr_code', 'code_128', 'ean_13', 'ean_8', 'code_39', 'upc_a', 'upc_e'],
          });
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

/**
 * Utility for isolated document printing.
 * Ensures that ONLY the target document (ID Card, Enrollment Card,
 * Leaving Certificate, Result Sheet, Confirmation Letter) is printed,
 * completely excluding the website header, navigation bar, sidebars,
 * background, and footer.
 */

export function printIsolatedElement(elementId: string, documentTitle?: string): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  const sourceElement = document.getElementById(elementId);
  if (!sourceElement) {
    console.warn(`Print target #${elementId} not found`);
    return false;
  }

  // Remove any previous print iframe
  const oldIframe = document.getElementById('isolated-print-frame');
  if (oldIframe) {
    oldIframe.remove();
  }

  // Deep clone the source element
  const clone = sourceElement.cloneNode(true) as HTMLElement;

  // Clean out any interactive buttons, icons, or controls marked not for print
  const noPrintSelectors = [
    'button',
    '.no-print',
    '[data-no-print="true"]',
    'input[type="button"]',
    'input[type="submit"]',
  ];
  clone.querySelectorAll(noPrintSelectors.join(',')).forEach((el) => el.remove());

  // Ensure clone is visible and shadow-free
  clone.style.margin = '0 auto';
  clone.style.boxShadow = 'none';

  // Create isolated invisible iframe to host only this single document
  const iframe = document.createElement('iframe');
  iframe.id = 'isolated-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    iframe.remove();
    return false;
  }

  // Collect all page styles so Tailwind utilities and fonts render accurately
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((el) => el.outerHTML)
    .join('\n');

  const titleText = documentTitle || 'GBHS_Mehrand_Document';

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${titleText}</title>
        ${styles}
        <style>
          @page {
            margin: 6mm;
            size: auto;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 8px !important;
            width: 100% !important;
            height: auto !important;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .printable-card {
            box-shadow: none !important;
            margin: 0 auto !important;
          }
          /* Hide anything marked no-print */
          .no-print, button, [data-no-print="true"] {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div style="width: 100%; display: flex; justify-content: center; align-items: flex-start; padding: 6px 0;">
          ${clone.outerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  let printed = false;
  const doPrint = () => {
    if (printed) return;
    printed = true;
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.warn('Iframe print failed, fallback:', err);
    }
    // Remove iframe after print dialog resolves
    setTimeout(() => {
      if (iframe && iframe.parentNode) {
        iframe.remove();
      }
    }, 2500);
  };

  // Wait for images and stylesheets in iframe to finish parsing
  if (iframe.contentWindow) {
    iframe.onload = () => {
      setTimeout(doPrint, 250);
    };
    setTimeout(doPrint, 450);
  }

  return true;
}

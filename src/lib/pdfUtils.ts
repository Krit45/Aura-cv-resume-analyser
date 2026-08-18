import { HTMLOptions } from 'jspdf';

/**
 * Replaces unsupported CSS color functions like oklch() and oklab() in CSS text
 * to prevent html2canvas from throwing "Attempting to parse an unsupported color function" errors.
 */
export const replaceUnsupportedCssColors = (cssText: string): string => {
  if (!cssText) return cssText;

  return cssText
    .replace(/oklch\(([^)]+)\)/gi, (match, content) => {
      try {
        const parts = content.trim().split(/[\s/]+/);
        let lightness = parseFloat(parts[0]);
        if (parts[0].includes('%')) {
          lightness = lightness / 100;
        }
        if (isNaN(lightness)) lightness = 0.5;

        const alpha = parts.length >= 4 ? parseFloat(parts[3]) : 1;
        const val = Math.round(Math.min(255, Math.max(0, lightness * 255)));

        if (alpha < 1 && !isNaN(alpha)) {
          return `rgba(${val}, ${val}, ${val}, ${alpha})`;
        }
        return `rgb(${val}, ${val}, ${val})`;
      } catch {
        return 'rgb(30, 41, 59)';
      }
    })
    .replace(/oklab\(([^)]+)\)/gi, 'rgb(30, 41, 59)');
};

/**
 * html2canvas onclone handler to sanitize cloned document styles for html2canvas
 */
export const sanitizeClonedDocumentForPdf = (clonedDoc: Document) => {
  // 1. Sanitize all <style> tags
  const styleTags = clonedDoc.querySelectorAll('style');
  styleTags.forEach((styleTag) => {
    if (styleTag.textContent) {
      styleTag.textContent = replaceUnsupportedCssColors(styleTag.textContent);
    }
  });

  // 2. Sanitize all elements with inline style attributes
  const elements = clonedDoc.querySelectorAll('*');
  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.getAttribute && htmlEl.getAttribute('style')) {
      const styleAttr = htmlEl.getAttribute('style');
      if (styleAttr && (styleAttr.includes('oklab') || styleAttr.includes('oklch'))) {
        htmlEl.setAttribute('style', replaceUnsupportedCssColors(styleAttr));
      }
    }
    if (htmlEl.style && htmlEl.style.cssText) {
      if (htmlEl.style.cssText.includes('oklab') || htmlEl.style.cssText.includes('oklch')) {
        htmlEl.style.cssText = replaceUnsupportedCssColors(htmlEl.style.cssText);
      }
    }
  });
};

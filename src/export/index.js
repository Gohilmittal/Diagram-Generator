/**
 * Export utilities for SVG and PNG
 */

/**
 * Export SVG as a downloadable file
 * @param {SVGElement} svgElement - The SVG element to export
 * @param {string} filename - Output filename
 */
export async function exportSVG(svgElement, filename = 'diagram.svg') {
  try {
    // Clone the SVG to avoid modifying the original
    const clone = svgElement.cloneNode(true);
    
    // Ensure SVG has proper attributes
    if (!clone.hasAttribute('xmlns')) {
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    
    // Create blob and download
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    downloadBlob(blob, filename);
  } catch (error) {
    throw new Error('Failed to export SVG: ' + error.message);
  }
}

/**
 * Export SVG as PNG using canvas
 * @param {SVGElement} svgElement - The SVG element to export
 * @param {string} filename - Output filename
 * @param {number} scale - Scale factor for export (default: 1)
 */
export async function exportPNG(svgElement, filename = 'diagram.png', scale = 1) {
  try {
    // Clone the SVG to avoid modifying the original
    const clone = svgElement.cloneNode(true);
    
    // Get dimensions
    const width = parseInt(clone.getAttribute('width')) || 800;
    const height = parseInt(clone.getAttribute('height')) || 600;
    
    // Create canvas with optional scaling
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    const ctx = canvas.getContext('2d');
    
    // Scale context if needed
    if (scale !== 1) {
      ctx.scale(scale, scale);
    }
    
    // Ensure SVG has proper attributes
    if (!clone.hasAttribute('xmlns')) {
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    
    // Convert SVG to data URL
    const svgString = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    // Load image and render to canvas
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG image'));
      };
      img.src = url;
    });
    
    // Convert to PNG and download
    const pngBlob = await new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/png');
    });
    
    if (!pngBlob) {
      throw new Error('Failed to create PNG blob');
    }
    
    downloadBlob(pngBlob, filename);
    
  } catch (error) {
    throw new Error('Failed to export PNG: ' + error.message);
  }
}

/**
 * Download a blob as a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - Output filename
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
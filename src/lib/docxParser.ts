import JSZip from 'jszip';

/**
 * Extracts formatted text paragraphs from a .docx file in the browser using JSZip and DOMParser.
 */
export async function parseDocxFile(file: File | Blob): Promise<string> {
  try {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(file);
    const xmlContent = await loadedZip.file('word/document.xml')?.async('string');
    if (!xmlContent) return '';

    const domParser = new DOMParser();
    const xmlDoc = domParser.parseFromString(xmlContent, 'application/xml');
    const pNodes = xmlDoc.getElementsByTagName('*');
    const paragraphs: string[] = [];

    for (let p = 0; p < pNodes.length; p++) {
      const node = pNodes[p];
      if (node.localName === 'p') {
        let pText = '';
        const tNodes = node.getElementsByTagName('*');
        for (let t = 0; t < tNodes.length; t++) {
          if (tNodes[t].localName === 't' && tNodes[t].textContent) {
            pText += tNodes[t].textContent;
          }
        }
        if (pText.trim()) {
          paragraphs.push(pText.trim());
        }
      }
    }

    return paragraphs.join('\n\n');
  } catch (err) {
    console.warn('Could not parse DOCX file:', err);
    return '';
  }
}

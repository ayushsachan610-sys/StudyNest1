import JSZip from 'jszip';
import { SlideData } from '../types';

export interface ParsedPresentation {
  title: string;
  slideCount: number;
  slides: SlideData[];
  fullText: string;
}

/**
 * Parses a PPTX file in the browser using JSZip and DOMParser.
 * Extracts slides in order, with titles, paragraph bullets, and full text.
 */
export async function parsePptxFile(file: File | Blob, defaultTitle?: string): Promise<ParsedPresentation> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);

  // Find all slide XML files
  const slideRegex = /^ppt\/slides\/slide(\d+)\.xml$/i;
  const slideEntries: { index: number; path: string }[] = [];

  loadedZip.forEach((relativePath) => {
    const match = relativePath.match(slideRegex);
    if (match) {
      slideEntries.push({
        index: parseInt(match[1], 10),
        path: relativePath,
      });
    }
  });

  // Sort slides in natural numerical order
  slideEntries.sort((a, b) => a.index - b.index);

  const slides: SlideData[] = [];
  const domParser = new DOMParser();

  for (let i = 0; i < slideEntries.length; i++) {
    const entry = slideEntries[i];
    const xmlContent = await loadedZip.file(entry.path)?.async('string');
    if (!xmlContent) continue;

    const xmlDoc = domParser.parseFromString(xmlContent, 'application/xml');

    // DrawingML paragraphs are usually <a:p> with text nodes <a:t>
    // In DOMParser, tag names with namespaces might be "a:p" or localName "p"
    const paragraphs: string[] = [];
    const pNodes = xmlDoc.getElementsByTagName('*');

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
        pText = pText.trim();
        if (pText && !paragraphs.includes(pText)) {
          paragraphs.push(pText);
        }
      }
    }

    const slideTitle = paragraphs.length > 0 ? paragraphs[0] : `Slide ${i + 1}`;
    const slideContent = paragraphs.join('\n');

    slides.push({
      slideNumber: i + 1,
      title: slideTitle,
      paragraphs,
      content: slideContent,
    });
  }

  // Derive presentation title from first slide or filename
  let presentationTitle = defaultTitle || 'Presentation';
  if (slides.length > 0 && slides[0].title) {
    // If first slide has title, use it
    presentationTitle = slides[0].title.replace(/[·|]/g, ' - ').trim();
  }

  const fullText = slides.map(s => `[Slide ${s.slideNumber}: ${s.title}]\n${s.content}`).join('\n\n');

  return {
    title: presentationTitle,
    slideCount: slides.length,
    slides,
    fullText,
  };
}

import { Resource } from '../types';

export function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case 'ppt':
      return 'application/vnd.ms-powerpoint';
    case 'pdf':
      return 'application/pdf';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'doc':
      return 'application/msword';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'zip':
      return 'application/zip';
    case 'rar':
      return 'application/x-rar-compressed';
    case '7z':
      return 'application/x-7z-compressed';
    case 'json':
      return 'application/json';
    case 'txt':
      return 'text/plain;charset=utf-8';
    case 'md':
    case 'markdown':
      return 'text/markdown;charset=utf-8';
    case 'csv':
      return 'text/csv;charset=utf-8';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

export interface PreviewCheckResult {
  supported: boolean;
  reason?: string;
  category: 'presentation' | 'document' | 'image' | 'code' | 'spreadsheet' | 'archive' | 'unsupported';
}

export function checkFilePreviewSupport(fileName: string): PreviewCheckResult {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // Supported Presentation Formats
  if (['pptx', 'ppt'].includes(ext)) {
    return { supported: true, category: 'presentation' };
  }

  // Supported PDF
  if (ext === 'pdf') {
    return { supported: true, category: 'document' };
  }

  // Supported Word Documents
  if (['docx', 'doc'].includes(ext)) {
    return { supported: true, category: 'document' };
  }

  // Supported Markdown & Plain Text
  if (['md', 'markdown', 'txt', 'rtf'].includes(ext)) {
    return { supported: true, category: 'document' };
  }

  // Supported Data/Code Formats
  if (['csv', 'tsv', 'json'].includes(ext)) {
    return { supported: true, category: 'code' };
  }

  // Supported Images
  if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext)) {
    return { supported: true, category: 'image' };
  }

  // Unsupported Spreadsheet Formats
  if (['xlsx', 'xls', 'xlsm'].includes(ext)) {
    return {
      supported: false,
      category: 'spreadsheet',
      reason:
        'Spreadsheet workbooks (.xlsx/.xls) contain complex multi-sheet calculations, cell formulas, and visual formatting designed for desktop software like Microsoft Excel or LibreOffice Calc. Web browsers cannot execute this proprietary format safely in real time.',
    };
  }

  // Unsupported Archive Formats
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
    return {
      supported: false,
      category: 'archive',
      reason:
        'Compressed archive packages (.zip/.rar/.7z) contain multiple bundled directories and compressed files that require desktop archive extraction tools (e.g. 7-Zip, WinRAR, or macOS Archive Utility).',
    };
  }

  // Unsupported Executables and System Packages
  if (['exe', 'dmg', 'pkg', 'msi', 'bin', 'apk', 'iso'].includes(ext)) {
    return {
      supported: false,
      category: 'unsupported',
      reason:
        'Executable packages and installer binaries contain machine code compiled directly for desktop operating systems and cannot be run inside a web sandbox.',
    };
  }

  // General fallback for unknown/unsupported extensions
  return {
    supported: false,
    category: 'unsupported',
    reason: `Files with extension ".${ext || 'unknown'}" require specialized desktop software to open. StudyNest keeps your original file safely stored so you can download and use it anytime.`,
  };
}

/**
 * Downloads the exact original file to the user's laptop.
 * - If resource.downloadUrl is set (e.g. /DT_Group_Presentation_7min.pptx), downloads from static asset.
 * - If resource.originalDataUrl is set, converts base64/dataURL directly to a download link.
 * - Otherwise builds a Blob with the appropriate MIME type.
 */
export function downloadOriginalFile(resource: Resource): void {
  // 1. Direct static download URL (e.g. public/DT_Group_Presentation_7min.pptx)
  if (resource.downloadUrl) {
    const link = document.createElement('a');
    link.href = resource.downloadUrl;
    link.download = resource.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 2. Base64 Data URL preserved during user upload
  if (resource.originalDataUrl) {
    const link = document.createElement('a');
    link.href = resource.originalDataUrl;
    link.download = resource.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 3. Fallback: Build typed Blob from content string
  const mime = getMimeType(resource.name);
  const blob = new Blob([resource.content || ''], { type: mime });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = resource.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}

import { ResourceType } from '../types';
import { checkFilePreviewSupport } from './downloadHelper';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  type?: ResourceType;
  canPreview: boolean;
  previewUnavailableReason?: string;
}

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 Megabytes

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function detectResourceType(fileName: string, mimeType?: string): ResourceType {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension === 'pptx') return 'pptx';
  if (extension === 'ppt') return 'ppt';
  if (extension === 'pdf' || mimeType === 'application/pdf') return 'pdf';
  if (extension === 'docx') return 'docx';
  if (extension === 'doc') return 'doc';
  if (extension === 'md' || extension === 'markdown') return 'markdown';
  if (['txt', 'rtf'].includes(extension || '')) return 'txt';
  if (['csv', 'tsv'].includes(extension || '')) return 'csv';
  if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(extension || '')) return 'image';
  if (['xlsx', 'xls', 'xlsm'].includes(extension || '')) return 'spreadsheet';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) return 'archive';
  if (['exe', 'dmg', 'pkg', 'bin', 'iso'].includes(extension || '')) return 'binary';

  return 'other';
}

export function validateStudyFile(file: File): ValidationResult {
  // Check size limit (50MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      canPreview: false,
      error: `File size (${formatBytes(file.size)}) exceeds the 50MB limit. Please choose a smaller file.`,
    };
  }

  const type = detectResourceType(file.name, file.type);
  const previewCheck = checkFilePreviewSupport(file.name);

  return {
    valid: true,
    type,
    canPreview: previewCheck.supported,
    previewUnavailableReason: previewCheck.reason,
  };
}

export async function readFileDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file as data URL.'));
    reader.readAsDataURL(file);
  });
}

export async function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const type = detectResourceType(file.name, file.type);
    if (type === 'pdf') {
      resolve(`[PDF Document: "${file.name}"]\nSize: ${formatBytes(file.size)}\nUploaded: ${new Date().toLocaleString()}\n\nThis PDF is openable and readable in the embedded PDF Reader.`);
      return;
    }
    if (type === 'docx' || type === 'doc') {
      resolve(`[Word Document: "${file.name}"]\nSize: ${formatBytes(file.size)}\nUploaded: ${new Date().toLocaleString()}\n\nFull formatted text available in Study View.`);
      return;
    }
    if (type === 'image') {
      resolve(`[Image Resource: ${file.name} - ${formatBytes(file.size)}]`);
      return;
    }
    if (['spreadsheet', 'archive', 'binary', 'other'].includes(type)) {
      resolve(`[File: "${file.name}"]\nSize: ${formatBytes(file.size)}\nType: ${type}\nIn-app preview not supported. Stored for safe download on your laptop.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file contents from disk.'));
    };
    reader.readAsText(file);
  });
}

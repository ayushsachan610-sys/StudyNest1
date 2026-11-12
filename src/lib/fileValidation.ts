import { ResourceType } from '../types';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  type?: ResourceType;
}

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 Megabytes

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function detectResourceType(fileName: string, mimeType?: string): ResourceType | null {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension === 'pdf' || mimeType === 'application/pdf') {
    return 'pdf';
  }
  if (extension === 'md' || extension === 'markdown') {
    return 'markdown';
  }
  if (['txt', 'rtf'].includes(extension || '')) {
    return 'txt';
  }
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'sql'].includes(extension || '')) {
    return 'code';
  }
  if (['csv', 'tsv'].includes(extension || '')) {
    return 'csv';
  }
  if (['doc', 'docx', 'odt'].includes(extension || '')) {
    return 'doc';
  }
  if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(extension || '')) {
    return 'image';
  }

  return null;
}

export function validateStudyFile(file: File): ValidationResult {
  // Check size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${formatBytes(file.size)}) exceeds the maximum 15MB limit. Please compress or choose a smaller file.`,
    };
  }

  // Check type
  const type = detectResourceType(file.name, file.type);
  if (!type) {
    const ext = file.name.split('.').pop();
    return {
      valid: false,
      error: `File format ".${ext || 'unknown'}" is not supported. StudyNest accepts PDF, Markdown, Text, Code (.py, .ts, .json), CSV, DOCX, and images.`,
    };
  }

  return {
    valid: true,
    type,
  };
}

export async function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's a binary-like file like PDF or image, we handle gracefully
    const type = detectResourceType(file.name, file.type);
    if (type === 'pdf') {
      resolve(`[Simulated PDF Text Extract for "${file.name}"]\n\nStudyNest has cataloged this PDF (${formatBytes(file.size)}). In full cloud mode with OCR/PDF parser configured, text layer extraction will index all pages.\n\nFile Name: ${file.name}\nSize: ${formatBytes(file.size)}\nUploaded: ${new Date().toLocaleString()}`);
      return;
    }
    if (type === 'image') {
      resolve(`[Image Resource: ${file.name} - ${formatBytes(file.size)}]`);
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

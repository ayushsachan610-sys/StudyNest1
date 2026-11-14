/**
 * Extract an 11-character YouTube video ID from various YouTube URL formats.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex for standard, short, mobile, and embed YouTube URLs
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : null;
}

/**
 * Validate a YouTube URL or video ID.
 */
export function validateYouTubeUrl(url: string): { valid: boolean; videoId?: string; error?: string } {
  if (!url || !url.trim()) {
    return { valid: false, error: 'Please enter a YouTube video URL or ID.' };
  }

  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return {
      valid: false,
      error: 'Invalid YouTube link. Please provide a standard YouTube video link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...).',
    };
  }

  return { valid: true, videoId };
}

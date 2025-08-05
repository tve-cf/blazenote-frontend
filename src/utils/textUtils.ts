/**
 * Strips HTML tags from a string and returns plain text
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  // Create a temporary element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Get text content and trim whitespace
  return temp.textContent?.trim() || '';
}

/**
 * Creates a preview of the content by stripping HTML and limiting length
 */
export function createContentPreview(
  content: string,
  maxLength: number = 100
): string {
  const plainText = stripHtml(content);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.slice(0, maxLength).trim() + '...';
}

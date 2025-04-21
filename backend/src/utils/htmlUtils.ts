import * as marked from 'marked';

/**
 * Convert markdown text to HTML for better rendering in the UI
 * @param text The markdown text to convert
 * @returns HTML formatted string
 */
export function markdownToHtml(text: string): string {
  try {
    // Use the synchronous parse function
    const html = marked.parse(text, {
      gfm: true,  // GitHub Flavored Markdown
      breaks: true // Convert line breaks to <br>
    });
    
    // Simple sanitization for security
    const sanitizedHtml = String(html)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, 'disabled-javascript:')
      .replace(/onerror=/gi, 'data-error=')
      .replace(/onclick=/gi, 'data-click=');
    
    return `<div class="markdown-content">${sanitizedHtml}</div>`;
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return `<div class="markdown-content">${text}</div>`;
  }
}

/**
 * Creates a formatted date string in a readable format
 * @returns Current date in a readable format
 */
export function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 
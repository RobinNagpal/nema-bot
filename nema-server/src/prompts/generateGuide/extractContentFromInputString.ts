export function extractStringContentWithoutUrls(content: string): string {
  // Regex to match URLs
  const urlPattern = /https?:\/\/[^\s]+/g;

  // Replacing URLs with an empty string
  const textWithoutUrls: string = content.replace(urlPattern, '').trim();

  return textWithoutUrls;
}

export function extractUrls(content: string): string[] {
  const urlPattern = /https?:\/\/[^\s]+/g;
  const matches: RegExpMatchArray | null = content.match(urlPattern);
  return matches ? matches : [];
}

export function getYouTubeEmbedUrl(urlOrId?: string): string | null {
  if (!urlOrId || !urlOrId.trim()) return null;

  const input = urlOrId.trim();

  // If already full embed url
  if (input.includes('youtube.com/embed/')) {
    return input;
  }

  // Regex patterns for standard YouTube URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = input.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}?rel=0&modestbranding=1`;
  }

  // If just the 11 character ID was passed
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return `https://www.youtube-nocookie.com/embed/${input}?rel=0&modestbranding=1`;
  }

  return null;
}

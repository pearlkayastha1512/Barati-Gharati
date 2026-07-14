const NEXT_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "res.cloudinary.com",
]);

export function isSupportedImageSrc(value?: string | null): value is string {
  const source = value?.trim();

  if (!source) return false;
  if (source.startsWith("/")) return true;

  try {
    const url = new URL(source);
    return url.protocol === "https:" && NEXT_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

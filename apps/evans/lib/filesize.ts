export function formatFilesize(bytes: number): string {
  const kilobytes = bytes / 1000;
  if (kilobytes < 1000) {
    return `${kilobytes.toFixed(1)} KB`;
  }
  const megabytes = kilobytes / 1000;
  if (megabytes < 1000) {
    return `${megabytes.toFixed(1)} MB`;
  }
  const gigabytes = megabytes / 1000;
  return `${gigabytes.toFixed(1)} GB`;
}

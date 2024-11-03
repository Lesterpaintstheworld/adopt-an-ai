export const getPerkIconUrl = async (item: any): Promise<string> => {
  if (!item) return '/perk-icons/default-perk-icon.png';

  // Helper function to check if image exists
  const checkImageExists = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Try different icon formats in order of preference
  const possibleUrls = [];

  // 1. Try name-ID format
  if (item.name && item.capability_id) {
    const sanitizedName = item.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    possibleUrls.push(`/perk-icons/${sanitizedName}-${item.capability_id}.png`);
  }

  // 2. Try capability_id only
  if (item.capability_id) {
    possibleUrls.push(`/perk-icons/${item.capability_id}.png`);
  }

  // 3. Try sanitized name only
  if (item.name) {
    const sanitizedName = item.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    possibleUrls.push(`/perk-icons/${sanitizedName}.png`);
  }

  // Try each URL in order until we find one that exists
  for (const url of possibleUrls) {
    if (await checkImageExists(url)) {
      return url;
    }
  }

  // If no icon is found, return default
  return '/perk-icons/default-perk-icon.png';
};

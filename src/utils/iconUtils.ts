export const getPerkIconUrl = (item: any): string => {
  if (!item) return '/perk-icons/default-perk-icon.png';
  
  // Format: nom-ID.png (e.g. email-communication-MLT_P1_001.png)
  if (item.name && item.capability_id) {
    const sanitizedName = item.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    return `/perk-icons/${sanitizedName}-${item.capability_id}.png`;
  }
  
  // Fallback to just capability_id if name is not available
  if (item.capability_id) {
    return `/perk-icons/${item.capability_id}.png`;
  }
  
  // Last resort: use sanitized name only
  if (item.name) {
    const sanitizedName = item.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    return `/perk-icons/${sanitizedName}.png`;
  }
  
  return '/perk-icons/default-perk-icon.png';
};

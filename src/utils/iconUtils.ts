export const getPerkIconUrl = (item: any): string => {
  if (!item) return '/perk-icons/default-perk-icon.png';
  
  // Try with capability_id first
  if (item.capability_id) {
    const iconPath = `/perk-icons/${item.capability_id}.png`;
    return iconPath;
  }
  
  // Use file_base_name as fallback
  if (item.file_base_name) {
    return `/perk-icons/${item.file_base_name}.png`;
  }
  
  // Last resort: use sanitized name
  if (item.name) {
    const sanitizedName = item.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    return `/perk-icons/${sanitizedName}.png`;
  }
  
  return '/perk-icons/default-perk-icon.png';
};

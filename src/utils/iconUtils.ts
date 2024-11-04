export const getPerkIconUrl = (item: any): string => {
  if (!item?.name || !item?.capability_id) return '/website/icons/default-perk-icon.png';
  
  // Convert name to URL-friendly format
  const safeName = item.name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace special chars with hyphens
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
    
  return `/website/icons/${safeName}-${item.capability_id}.png`;
};

export const getPerkIconUrl = (item: any): string => {
  if (!item?.name || !item?.capability_id) return 'perk-icons/default-perk-icon.png';
  
  // Convert name to URL-friendly format
  const safeName = item.name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace special chars with hyphens
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
    
  return `perk-icons/${safeName}-${item.capability_id}.png`;
};

export const getPerkIllustrationUrl = (item: any): string => {
  if (!item?.name || !item?.capability_id) return 'perk_illustrations/default-illustration.png';
  
  // Convert name to URL-friendly format using same rules as icons
  const safeName = item.name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
    
  return `perk_illustrations/${safeName}-${item.capability_id}.png`;
};
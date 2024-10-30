// Get the URL for a perk's icon (for use in the frontend)
export const getPerkIconUrl = (perkName: string): string => {
  const filename = perkName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.png';
  return `/perk-icons/${filename}`;
};

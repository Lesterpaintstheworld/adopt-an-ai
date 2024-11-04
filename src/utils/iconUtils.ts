export const getPerkIconUrl = (item: any): string => {
  if (!item?.file_base_name) return '/website/icons/default-perk-icon.png';
  return `/website/icons/${item.file_base_name}.png`;
};

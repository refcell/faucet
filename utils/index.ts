// * Simple gas conversion utility function
export const gweiToWei = (gwei: string | number) => {
  return 1e9 * parseFloat(gwei.toString());
};

export { shouldThrow } from './shouldThrow';
// * Simple gas conversion utility function
const gweiToWei = (gwei: string | number) => {
  return 1e9 * parseFloat(gwei.toString());
};

export default gweiToWei;
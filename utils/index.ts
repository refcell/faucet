// * Simple gas conversion utility function
export const gweiToWei = (gwei: string | number) => {
  return 1e9 * parseFloat(gwei.toString());
};

// * External Exports
export { default as checkDeployed } from "./checkDeployed";
export { default as ImportantLog } from "./importantLog";
export { default as checkMainnet } from "./checkMainnet";
export { default as RetryOperation } from "./retryOperation";
export { default as ShouldThrow } from "./shouldThrow";
export { default as Sleep } from "./sleep";
export default {
  getIsLoading: (state) => state.isLoading,
  getLoaderStatusText: (state) => state.loaderStatusText,
  getLoaderMode: (state) => state.loaderMode,
  getLoaderProgress: (state) => state.loaderProgress,
  getIsLoaderBackgroundHider: (state) => state.isLoaderBackgroundHider,
  getIsWalletConnected: (state) => state.isWalletConnected,
  getWalletAddress: (state) => state.walletAddress,
  getIsDefaultChainId: (state) => state.isDefaultChainId,
};

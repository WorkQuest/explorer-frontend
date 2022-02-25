export default {
  getIsLoading: (state) => state.isLoading,
  getLoaderStatusText: (state) => state.loaderStatusText,
  getLoaderMode: (state) => state.loaderMode,
  getLoaderProgress: (state) => state.loaderProgress,
  getProjects: (state) => state.projects,
  getIsLoaderBackgroundHider: (state) => state.isLoaderBackgroundHider,
  getWUSDTokenData: (state) => state.wusd,
  getWUSDTokenSymbol: (state) => state.wusd.symbol,
  getWUSDTokenDecimals: (state) => state.wusd.decimals,
};

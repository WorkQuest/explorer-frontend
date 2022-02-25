export default {
  getIsLoading: (state) => state.isLoading,
  getLoaderStatusText: (state) => state.loaderStatusText,
  getLoaderMode: (state) => state.loaderMode,
  getLoaderProgress: (state) => state.loaderProgress,
  getProjects: (state) => state.projects,
  getIsLoaderBackgroundHider: (state) => state.isLoaderBackgroundHider,
  getWQTTokenData: (state) => state.tokensData.wqt,
  getNativeTokenData: (state) => state.tokensData.nativeToken,
};

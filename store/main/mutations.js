export default {
  setLoading(state, value) {
    state.isLoading = value;
  },
  setStatusText(state, value) {
    state.loaderStatusText = value;
  },
  setLoaderMode(state, value) {
    state.loaderMode = value;
  },
  setLoaderProgress(state, value) {
    state.loaderProgress = value;
  },
  setIsLoaderBackgroundHider(state, value) {
    state.isLoaderBackgroundHider = value;
  },
  setIsWalletConnected(state, value) {
    state.isWalletConnected = value;
  },
};

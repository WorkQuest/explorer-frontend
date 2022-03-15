import { serverErrorMessage } from '~/utils';

/* eslint-disable no-param-reassign,consistent-return */
// eslint-disable-next-line func-names
export default function ({ $axios, app, error: nuxtError }) {
  const { locale } = app.i18n;
  $axios.onError(async (config) => {
    console.dir(config.request.responseURL);
    const serverMessage = config.response.data?.msg || '';
    if (config.response.status === 404) {
      nuxtError({ statusCode: 404, message: serverErrorMessage(app, locale, serverMessage) });
      throw config;
    }
    nuxtError({ statusCode: 500, message: serverErrorMessage(app, locale, serverMessage) });
    throw config;
  });
  $axios.onResponse(async (config) => {
    if (config.request.responseURL.includes('search')) {
      const isSearchResultExist = !!config.data.result.searchResult;
      const emptyResult = Array.isArray(config.data.result.searchResult?.rows) && config.data.result.searchResult?.rows.length === 0;
      let serverMessage;
      if ((isSearchResultExist && emptyResult) || !isSearchResultExist) {
        console.dir(config.request.responseURL);
        serverMessage = config.data?.result?.msg || '';
        nuxtError({
          statusCode: 404,
          message: serverErrorMessage(app, locale, serverMessage),
        });
        throw config;
      }
      return config;
    }
    return config;
  });
}

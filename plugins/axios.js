/* eslint-disable no-param-reassign,consistent-return */
// eslint-disable-next-line func-names
export default function ({ $axios, app, error: nuxtError }) {
  const { locale } = app.i18n;
  $axios.onError(async (config) => {
    if (config.response.status === 404) {
      nuxtError({ statusCode: 404, message: app.i18n.messages[locale].errors.pageNotFound });
      return config;
    }
    nuxtError({ statusCode: 500, message: app.i18n.messages[locale].errors.other });
    return config;
  });
  $axios.onResponse(async (config) => {
    if (config.request.responseURL.includes('search') && !config.data.result.searchResult) {
      nuxtError({ statusCode: 404, message: app.i18n.messages[locale].errors.pageNotFound });
    }
    return config;
  });
}

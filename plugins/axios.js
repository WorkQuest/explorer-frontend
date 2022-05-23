import { serverErrorMessage } from '~/utils';

/* eslint-disable no-param-reassign,consistent-return */
// eslint-disable-next-line func-names
export default function ({ $axios, app, error: nuxtError }) {
  const { locale } = app.i18n;
  $axios.onError(async (config) => {
    const serverMessage = config.response.data?.msg || '';
    if (config.response.status === 404) {
      nuxtError({ statusCode: 404, message: serverErrorMessage(app, locale, serverMessage) });
      throw config;
    }
    nuxtError({ statusCode: 500, message: serverErrorMessage(app, locale, serverMessage) });
    throw config;
  });
}

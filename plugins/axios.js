import { serverErrorMessage } from '~/utils';
import { getTransactionByTxHash } from '~/utils/web3';

/* eslint-disable no-param-reassign,consistent-return */
// eslint-disable-next-line func-names
export default function ({
  $axios, app, error: nuxtError, route,
}) {
  const { locale } = app.i18n;
  $axios.onError(async (config) => {
    const serverMessage = config.response.data?.msg || '';
    if (config.response.status === 404) {
      if (route.name === 'tx-id' && route.params.id) {
        const tx = await getTransactionByTxHash(route.params.id);
        if (tx.ok) return true;
      } else if (config.url.includes('/transactions/count')) return true;
      nuxtError({ statusCode: 404, message: serverErrorMessage(app, locale, serverMessage) });
      throw config;
    }
    nuxtError({ statusCode: 500, message: serverErrorMessage(app, locale, serverMessage) });
    throw config;
  });
}

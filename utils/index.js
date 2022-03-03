import { SERVER_MESSAGES } from '~/utils/serverMessages';

// eslint-disable-next-line import/prefer-default-export
export const searchResponseTypes = (type, value) => {
  const types = {
    0: `/blocks/${value || ''}`,
    1: `/transactions/${value || ''}`,
    2: `/blocks/${value || ''}`,
    3: `/contracts/${value || ''}`,
    4: `/address/${value || ''}`,
    5: `/tokens/${value || ''}`,
    6: `/tokens/${value || ''}`,
    7: null,
  };
  return types[type];
};

export const searchTypes = {
  all: null,
  address: 0,
  txnHash: null,
  block: null,
  token: 1,
  tokens: 2,
};

export const output = (res) => ({
  ok: true,
  result: res,
});

export const error = (code, msg, data) => ({
  ok: false,
  code,
  msg,
  data,
});

export const serverErrorMessage = (app, locale, serverMessage) => {
  if (!locale) {
    return app.i18n.messages[locale].errors.other;
  }
  switch (serverMessage) {
    case SERVER_MESSAGES.BLOCK_NOT_FOUND: {
      return app.i18n.messages[locale].errors.blockNotFound;
    }
    case SERVER_MESSAGES.TRANSACTION_NOT_FOUND: {
      return app.i18n.messages[locale].errors.transactionNotFound;
    }
    case SERVER_MESSAGES.VALIDATION_ERROR: {
      return app.i18n.messages[locale].errors.other;
    }
    default: {
      return app.i18n.messages[locale].errors.pageNotFound;
    }
  }
};

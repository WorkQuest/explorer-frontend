import { SERVER_MESSAGES } from '~/utils/serverMessages';

// eslint-disable-next-line import/prefer-default-export
export const searchResponseTypes = (type, value) => {
  const types = {
    0: `/blocks/${value || ''}`,
    1: `/tx/${value || ''}`,
    2: `/blocks/${value || ''}`,
    3: `/contract/${value || ''}`,
    4: `/address/${value || ''}`,
    5: `/tokens/?search=${value || ''}`,
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
    return app.i18n.messages.en.errors.other;
  }
  const { errors } = app.i18n.messages[locale];
  switch (serverMessage) {
    case SERVER_MESSAGES.BLOCK_NOT_FOUND: {
      return errors.blockNotFound;
    }
    case SERVER_MESSAGES.TRANSACTION_NOT_FOUND: {
      return errors.transactionNotFound;
    }
    case SERVER_MESSAGES.VALIDATION_ERROR: {
      return errors.other;
    }
    case SERVER_MESSAGES.OTHER: {
      return errors.other;
    }
    default: {
      return errors.pageNotFound;
    }
  }
};

export const isArrayType = (typeString) => {
  if (typeof typeString !== 'string') return false;
  const regex = /\[]/;
  return typeString.search(regex) >= 0;
};

export const splitString = (str) => {
  if (typeof str !== 'string') return [];
  const regex = /,\s|,|\s,|;\s|;|\s/;
  return str.split(regex).map((item) => item.trim());
};

export const isTuple = (obj) => {
  if (Array.isArray(obj)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      if (isNaN(parseInt(key, 10))) {
        // eslint-disable-next-line no-plusplus
        return true;
      }
    }
  }
  return false;
};

export const convertFromTupleToString = (tuple) => {
  if (Array.isArray(tuple)) {
    let result = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const key in tuple) {
      if (isNaN(parseInt(key, 10))) {
        result += ` ${key}: ${tuple[key]}, `;
      }
    }
    return result.trim().slice(0, -1);
  }
  return '';
};

export const isMap = (obj) => {
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    return Object.entries(obj).some(([key, value]) => !isNaN(parseInt(key, 10)));
  }
  return false;
};

export const convertFromMapToArray = (map) => {
  if (typeof map === 'object' && !Array.isArray(map)) {
    return Object.entries(map).reduce((arr, [key, value]) => {
      if (!isNaN(parseInt(key, 10))) {
        arr.push(value);
      }
      return arr;
    }, []);
  }
  return [];
};

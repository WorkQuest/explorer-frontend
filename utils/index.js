import BigNumber from 'bignumber.js';
import { SERVER_MESSAGES } from '~/utils/serverMessages';

BigNumber.config({ EXPONENTIAL_AT: 256 });

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

export const sortTables = {
  transactions: ['hash', 'block.timestamp', 'block_number', 'from_address_hash', 'to_address_hash', 'value', 'gas_used'],
  blocks: ['number', 'timestamp', 'gas_used', 'gas_limit'],
  holders: ['value'],
  transfers: ['transaction_hash', 'block.timestamp', 'from_address_hash', 'to_address_hash', 'amount'],
  tokens: ['name', 'symbol', 'holder_count'],
};

export const sortDirections = {
  ASC: 'ASC',
  DESC: 'DESC',
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

export const isValidAddress = (address, toChecksumAddress, isAddress) => {
  if (!address || !toChecksumAddress || !isAddress) return false;
  try {
    const checksum = toChecksumAddress(address);
    return isAddress(checksum);
  } catch (e) {
    return false;
  }
};

export const isValidByte = (byte, bits, stripHexPrefix, isHexStrict) => {
  if (!byte || !stripHexPrefix || !isHexStrict) return false;
  const isLengthEqual = (stripHexPrefix(byte).length / 2) === (+bits ? +bits : 1);
  return isHexStrict(byte) && (bits ? isLengthEqual : true);
};

export const isValidUint = (uint, bits) => {
  if (!uint) return false;
  const valueToCheck = new BigNumber(uint);
  const maxValue = new BigNumber(2).pow(bits ? +bits : 1).minus(1);
  return valueToCheck.isGreaterThanOrEqualTo(0) && valueToCheck.isLessThanOrEqualTo(maxValue) && valueToCheck.isInteger();
};

export const isValidInt = (int, bits) => {
  if (!int) return false;
  const valueToCheck = new BigNumber(int);
  const minValue = new BigNumber(-2).pow(bits ? 1 : +bits - 1);
  const maxValue = new BigNumber(2).pow(bits ? 1 : +bits - 2);
  return valueToCheck.isGreaterThanOrEqualTo(minValue) && valueToCheck.isLessThanOrEqualTo(maxValue) && valueToCheck.isInteger();
};

export const isValidBech32 = (address) => {
  const regex = /^(wq1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
  return regex.test(address);
};

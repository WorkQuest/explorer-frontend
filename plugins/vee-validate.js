import Vue from 'vue';
import {
  isAddress, isHexStrict, stripHexPrefix, toChecksumAddress,
} from 'web3-utils';

import {
  configure, extend, setInteractionMode, ValidationObserver, ValidationProvider,
} from 'vee-validate';

import * as rules from 'vee-validate/dist/rules';
import {
  isValidAddress, isValidByte, isValidInt, isValidUint, splitString,
} from '~/utils';
import { ValidateType } from '~/utils/VeeValidateTypes';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
setInteractionMode('eager');

Object.keys(rules).forEach((rule) => {
  extend(rule, {
    ...rules[rule],
  });
});

export default ({ app }) => {
  configure({
    defaultMessage: (_field_, values) => app.i18n.t(`messages.${values._rule_}`, values),
  });
  extend('type', {
    validate: ((value, [type]) => {
      const mustBeArray = type.includes(ValidateType.ARRAY);
      const inputArray = splitString(value);
      const isActualArray = !inputArray.includes('');
      if ((mustBeArray && !isActualArray) || (!mustBeArray && inputArray.length > 1)) {
        return false;
      }
      if (type.includes(ValidateType.ADDRESS)) {
        return !inputArray.map((val) => isValidAddress(val, toChecksumAddress, isAddress)).some((v) => v === false);
      }
      if (type.includes(ValidateType.BYTES)) {
        const [, bits] = type.split(ValidateType.BYTES);
        return !inputArray.map((val) => isValidByte(val, mustBeArray ? bits.replace('[]', '') : bits, stripHexPrefix, isHexStrict)).some((v) => v === false);
      }
      if (type.includes(ValidateType.UINT)) {
        const [, bits] = type.split(ValidateType.UINT);
        return !inputArray.map((val) => isValidUint(val, mustBeArray ? bits.replace('[]', '') : bits)).some((v) => v === false);
      }
      if (type.includes(ValidateType.INT)) {
        const [, bits] = type.split(ValidateType.INT);
        return !inputArray.map((val) => isValidInt(val, mustBeArray ? bits.replace('[]', '') : bits).some((v) => v === false));
      }
      if (type.includes(ValidateType.BOOL)) {
        return value === 'true' || value === 'false';
      }
      return true;
    }),
    message: (field, params) => {
      const isArray = params[0].includes(ValidateType.ARRAY);
      return `The ${field} must be valid ${params[0]} type${isArray ? "'s array" : ''}`;
    },
  });
};

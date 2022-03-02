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

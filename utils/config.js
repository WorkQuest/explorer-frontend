// MAIN | TEST | DEV

export const NetworkData = new Map([
  ['MAIN', {
    chainId: '0x0000001',
    chainName: 'WorkQuest',
    rpcUrls: ['https://dev-node-nyc3.workquest.co'],
    nativeCurrency: {
      name: 'WQT',
      symbol: 'WQT',
      decimals: 18,
    },
    blockExplorerUrls: ['https://dev-explorer.workquest.co'],
  }],
  ['TEST', {
    chainId: '0x7C7',
    chainName: 'WorkQuest TEST',
    rpcUrls: ['https://testnet-gate.workquest.co/rpc/'],
    nativeCurrency: {
      name: 'WQT',
      symbol: 'WQT',
      decimals: 18,
    },
    blockExplorerUrls: ['https://testnet-explorer.workquest.co'],
  }],
  ['DEV', {
    chainId: '0x13488D0',
    chainName: 'WorkQuest DEV',
    rpcUrls: ['https://dev-node-nyc3.workquest.co'],
    nativeCurrency: {
      name: 'WQT',
      symbol: 'WQT',
      decimals: 18,
    },
    blockExplorerUrls: ['https://dev-explorer.workquest.co'],
  }],
]);

export const links = {
  terms: 'https://workquest.co/terms_conditions',
  privacy: 'https://workquest.co/privacy_policy',
  metamask: 'https://metamask.io/',
};

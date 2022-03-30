// MAIN | TEST | DEV

export const NetworkData = new Map([
  ['MAIN', {
    chainId: '0x0000001',
    chainName: 'WorkQuest',
    rpcUrls: ['https://dev-node-nyc3.workquest.co'],
    nativeCurrency: {
      name: 'WUSD',
      symbol: 'WUSD',
      decimals: 18,
    },
    blockExplorerUrls: ['https://dev-explorer.workquest.co'],
  }],
  ['TEST', {
    chainId: '0x13488D0',
    chainName: 'WorkQuest TEST',
    rpcUrls: ['https://dev-node-nyc3.workquest.co'],
    nativeCurrency: {
      name: 'WUSD',
      symbol: 'WUSD',
      decimals: 18,
    },
    blockExplorerUrls: ['https://dev-explorer.workquest.co'],
  }],
  ['DEV', {
    chainId: '0x13488D0',
    chainName: 'WorkQuest DEV',
    rpcUrls: ['https://dev-node-nyc3.workquest.co'],
    nativeCurrency: {
      name: 'WUSD',
      symbol: 'WUSD',
      decimals: 18,
    },
    blockExplorerUrls: ['https://dev-explorer.workquest.co'],
  }],
]);

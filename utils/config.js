// MAIN | TEST | DEV

export const NetworkData = new Map([
  [
    'MAIN',
    {
      chainId: '0x7D9',
      chainName: 'WorkNet',
      rpcUrls: ['https://mainnet-gate.workquest.co/'],
      nativeCurrency: {
        name: 'WQT',
        symbol: 'WQT',
        decimals: 18,
      },
      blockExplorerUrls: ['https://explorer.workquest.co'],
    },
  ],
  [
    'TEST',
    {
      chainId: '0x7C7',
      chainName: 'WorkNet TEST',
      rpcUrls: ['https://testnet-gate.workquest.co/'],
      nativeCurrency: {
        name: 'WQT',
        symbol: 'WQT',
        decimals: 18,
      },
      blockExplorerUrls: ['https://testnet-explorer.workquest.co'],
    },
  ],
  [
    'DEV',
    {
      chainId: '0x13488D0',
      chainName: 'WorkNet DEV',
      rpcUrls: ['https://dev-node-nyc3.workquest.co'],
      nativeCurrency: {
        name: 'WQT',
        symbol: 'WQT',
        decimals: 18,
      },
      blockExplorerUrls: ['https://dev-explorer.workquest.co'],
    },
  ],
]);

export const links = {
  terms: 'https://workquest.co/terms_conditions.html',
  privacy: 'https://workquest.co/privacy_policy.html',
  metamask: 'https://metamask.io/',
};

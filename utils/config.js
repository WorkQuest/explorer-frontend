export const NetworkData = () => (process.env.IS_MAINNET ? {
  chainId: '0x13488D0',
  chainName: 'WorkQuest DEV',
  rpcUrls: ['https://dev-node-nyc3.workquest.co'],
  nativeCurrency: {
    name: 'WUSD',
    symbol: 'WUSD',
    decimals: 18,
  },
} : {
  chainId: '0x13488D0',
  chainName: 'WorkQuest DEV',
  rpcUrls: ['https://dev-node-nyc3.workquest.co'],
  nativeCurrency: {
    name: 'WUSD',
    symbol: 'WUSD',
    decimals: 18,
  },
});

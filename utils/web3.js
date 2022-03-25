import Web3 from 'web3';
import {
  convertFromTupleToString, error, isTuple, output, isMap, convertFromMapToArray,
} from '~/utils/index';
import { NetworkData } from '~/utils/config';

const { WQ_PROVIDER } = process.env;

let web3Anonymous = null;
let web3Wallet = null;
let currentNetwork = null;

let store;

if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    store = $store;
  });
}

const _ethereumRequest = async (ethereum, method, params = null) => {
  console.log('__ethereumRequest: ', ethereum, method, params);
  await ethereum.request({ method, params: [params] });
};

const connectProvider = async () => {
  const isListening = await web3Anonymous?.eth?.net?.isListening() || false;
  if (isListening) return web3Anonymous;
  web3Anonymous = new Web3();
  try {
    const provider = new Web3.providers.HttpProvider(WQ_PROVIDER);
    web3Anonymous.setProvider(provider);
    return web3Anonymous;
  } catch (e) {
    throw error(501, 'connectProvider', e);
  }
};

export const fetchContractData = async (type = 'read', abi, address, method, params = null) => {
  try {
    let response = null;
    const instance = await connectProvider();
    const contract = new instance.eth.Contract(abi, address);
    if (type === 'read') {
      response = await contract.methods[method].apply(this, params).call();
    }
    if (type === 'write') {
      return error(500, 'write', '');
    }
    if (response && isTuple(response)) {
      return output(convertFromTupleToString(response));
    }
    if (response && isMap(response)) {
      return output(convertFromMapToArray(response));
    }
    if (response && Array.isArray(response)) {
      return output(response.join(', '));
    }
    return output(response);
  } catch (e) {
    console.dir('fetchContractData: ', e);
    return error(500, 'readContractData', e);
  }
};

export const isWalletConnected = () => web3Wallet;

export const connectWallet = async () => {
  const { ethereum } = window || null;
  if (!ethereum) {
    return error(449, 'metamask is not installed');
  }
  web3Wallet = web3Wallet || new Web3(ethereum);
  currentNetwork = await web3Wallet.eth.net.getNetworkType();
  const eth_requestAccounts = await _ethereumRequest(ethereum, 'eth_requestAccounts');
  const networkData = NetworkData();
  try {
    await _ethereumRequest(ethereum, 'wallet_switchEthereumChain', { chainId: networkData.chainId });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await _ethereumRequest(ethereum, 'wallet_addEthereumChain', networkData);
      } catch (addError) {
        return error(450, 'switch error');
      }
    }
    return error(451, 'switch error');
  }
  return null;
};

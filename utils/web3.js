import Web3 from 'web3';
import {
  convertFromTupleToString, error, isTuple, output, isMap, convertFromMapToArray,
} from '~/utils/index';
import { MainNetNetworkData, TestNetNetworkData } from '~/utils/config';
import { ERROR, METHOD } from '~/utils/RPCTypes';

const { WQ_PROVIDER, IS_MAINNET } = process.env;

let web3Anonymous = null;
const web3Wallet = null;
const currentNetwork = null;

const _ethereumRequest = async (ethereum, method, params = null) => {
  console.log('__ethereumRequest: ', ethereum, method, params);
  await ethereum.request({ method, params: [params] });
};

const getChainId = async (ethereum) => await _ethereumRequest(ethereum, METHOD.GET_CHAIN_ID);
const getAccount = async (ethereum) => await _ethereumRequest(ethereum, METHOD.REQUEST_ACCOUNT);
const switchToChain = async (ethereum, toChainId) => await _ethereumRequest(ethereum, METHOD.SWITCH_CHAIN, { chainId: toChainId });
const addChain = async (ethereum, network) => await _ethereumRequest(ethereum, METHOD.ADD_CHAIN, network);

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

export const connectWallet = async () => {
  const { ethereum } = window || null;
  if (!ethereum) {
    return error(449, 'metamask is not installed');
  }
  const networkData = IS_MAINNET ? MainNetNetworkData : TestNetNetworkData;
  console.log('networkData: ', networkData);
  // web3Wallet = web3Wallet || new Web3(ethereum);
  // currentNetwork = await web3Wallet.eth.net.getNetworkType();
  const account = await getAccount(ethereum);
  console.log('account: ', account);
  const chainId = await getChainId(ethereum);
  console.log('chainId: ', chainId);

  try {
    const switchTo = await switchToChain(ethereum, networkData.chainId);
    console.log('switchTo: ', switchTo);
  } catch (switchError) {
    if (switchError.code === ERROR.NETWORK_MISSING) {
      try {
        const add = await addChain(ethereum, networkData);
        console.log('add chain: ', add);
      } catch (addError) {
        console.log('addError: ', addError);
        return error(450, 'switch error');
      }
    }
    return error(451, 'switch error');
  }
  return null;
};

import Web3 from 'web3';
import {
  convertFromMapToArray, convertFromTupleToString, error, isMap, isTuple, output,
} from '~/utils/index';
import { MainNetNetworkData, TestNetNetworkData } from '~/utils/config';
import { ERROR, EVENT, METHOD } from '~/utils/RPCTypes';

const { WQ_PROVIDER } = process.env;
const { IS_MAINNET } = process.env;

let web3Anonymous = null;
let store;
const networkData = IS_MAINNET === 'true' ? MainNetNetworkData : TestNetNetworkData;

if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    store = $store;
  });
}

const _ethereumRequest = async (method, params = null) => {
  const { ethereum } = window || null;
  if (ethereum) {
    return await ethereum.request({ method, params: [params] });
  }
  return null;
};

const ethGetChainId = async () => await _ethereumRequest(METHOD.GET_CHAIN_ID);
const ethGetAccount = async () => await _ethereumRequest(METHOD.REQUEST_ACCOUNT);
const ethSwitchToChain = async (toChainId) => await _ethereumRequest(METHOD.SWITCH_CHAIN, { chainId: toChainId });
const ethAddChain = async (network) => await _ethereumRequest(METHOD.ADD_CHAIN, network);
const ethOnConnectHandler = async ({ chainId }) => {
  const account = await ethGetAccount();
  if (store) {
    if (account && Array.isArray(account) && account.length > 0 && chainId.toUpperCase() === networkData.chainId.toUpperCase()) {
      store.commit('main/setWalletAddress', account[0]);
      store.commit('main/setIsWalletConnected', true);
      store.commit('main/setIsDefaultChainId', chainId.toUpperCase() === networkData.chainId.toUpperCase());
    } else {
      store.commit('main/resetConnection');
    }
  }
};
const ethOnChainChangesHandler = async (chainId) => {
  if (store) {
    if (chainId.toUpperCase() === networkData.chainId.toUpperCase()) {
      store.commit('main/setIsDefaultChainId', chainId.toUpperCase() === networkData.chainId.toUpperCase());
    } else {
      store.commit('main/resetConnection');
    }
  }
};
const ethOnDisconnectHandler = async () => {
  if (store) {
    store.commit('main/resetConnection');
  }
};

const removeEthereumListeners = (ethereum) => {
  ethereum.removeListener(EVENT.CONNECT, ethOnConnectHandler);
  ethereum.removeListener(EVENT.CHAIN_CHANGED, ethOnChainChangesHandler);
  ethereum.removeListener(EVENT.DISCONNECT, ethOnDisconnectHandler);
};

const addEthereumListeners = (ethereum) => {
  ethereum.on(EVENT.CONNECT, ethOnConnectHandler);
  ethereum.on(EVENT.CHAIN_CHANGED, ethOnChainChangesHandler);
  ethereum.on(EVENT.DISCONNECT, ethOnDisconnectHandler);
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
      console.log('abi: ', abi);
      console.log('address: ', address);
      console.log('method: ', method);
      console.log('params: ', params);
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

export const addChain = async () => {
  try {
    return output(await ethAddChain(networkData));
  } catch (addChainError) {
    return error(addChainError.code, addChainError.message, addChainError.data);
  }
};

export const switchChain = async () => {
  try {
    return output(await ethSwitchToChain(networkData.chainId));
  } catch (switchError) {
    return error(switchError.code, switchError.message, switchError.data);
  }
};

export const connectWallet = async () => {
  const { ethereum } = window || null;
  if (!ethereum) {
    return error(ERROR.METAMASK_IS_NOT_INSTALLED);
  }
  removeEthereumListeners(ethereum);
  addEthereumListeners(ethereum);

  try {
    const account = await ethGetAccount();
    if (account && Array.isArray(account) && account.length > 0 && store) {
      store.commit('main/setWalletAddress', account[0]);
      store.commit('main/setIsWalletConnected', true);
    }
  } catch (e) {
    return error(ERROR.USER_REJECT);
  }
  let chainId = await ethGetChainId();

  if (chainId.toUpperCase() !== networkData.chainId.toUpperCase()) {
    const requestSwitch = await switchChain(networkData);
    if (requestSwitch.ok) {
      chainId = await ethGetChainId();
      store.commit('main/setIsDefaultChainId', chainId.toUpperCase() === networkData.chainId.toUpperCase());
      return output();
    }
    if (requestSwitch.code === ERROR.NETWORK_MISSING) {
      const requestAddChain = await addChain();
      if (requestAddChain.ok) {
        chainId = await ethGetChainId();
        if (chainId.toUpperCase() === networkData.chainId.toUpperCase()) {
          store.commit('main/setIsDefaultChainId', chainId.toUpperCase() === networkData.chainId.toUpperCase());
          return output();
        }
        return error(ERROR.USER_REJECT);
      }
      store.commit('main/resetConnection');
      return error(ERROR.USER_REJECT);
    }
    if (requestSwitch.code === ERROR.USER_REJECT) {
      return error(ERROR.USER_REJECT);
    }
  }

  store.commit('main/setIsDefaultChainId', chainId.toUpperCase() === networkData.chainId.toUpperCase());
  return output();
};

import Web3 from 'web3';
import {
  convertFromMapToArray, convertFromTupleToString, error, isMap, isTuple, output,
} from '~/utils/index';
import { MainNetNetworkData, TestNetNetworkData } from '~/utils/config';
import { ERROR, EVENT, METHOD } from '~/utils/RPCTypes';

const { WQ_PROVIDER } = process.env;
const { IS_MAINNET } = process.env;

let web3Anonymous = null;
const web3Wallet = null;
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

const connectProvider = async (type = 'read') => {
  const { ethereum } = window || null;
  let isListening = false;

  if (type === 'read') {
    isListening = await web3Anonymous?.eth?.net?.isListening() || false;
    if (isListening) return web3Anonymous;
    web3Anonymous = new Web3();
    try {
      const provider = new Web3.providers.HttpProvider(WQ_PROVIDER);
      web3Anonymous.setProvider(provider);
      return web3Anonymous;
    } catch (e) {
      throw error(501, 'connectProvider', e);
    }
  }

  if (type === 'write') {
    isListening = web3Wallet && ethereum && ethereum.isConnected();
    if (isListening) return web3Wallet;
    return new Web3(ethereum);
  }

  return null;
};

export const fetchContractData = async (type = 'read', abi, address, method, params = null) => {
  const instance = await connectProvider(type);
  const contract = new instance.eth.Contract(abi, address);

  if (type === 'read') {
    let response = null;
    try {
      response = await contract.methods[method].apply(this, params).call();
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
      return error(500 || e.code, e.message, e);
    }
  }
  if (type === 'write' && store) {
    let transactionHash = null;
    let transactionReceipt = null;
    let transactionError = null;

    const walletAddress = store.getters['main/getWalletAddress'];
    try {
      const request = await contract.methods[method].apply(this, params).send({ from: walletAddress })
        .on('error', (err, receipt) => {
          transactionError = err;
          transactionReceipt = receipt;
          return transactionError;
        });
      transactionHash = request.transactionHash;
      if (!transactionError) {
        return output({ transactionHash });
      }
      return error(ERROR.INVALID_PARAMS, transactionError, transactionError);
    } catch (writeError) {
      console.dir('fetchContractDat err: ', writeError);
      return error(ERROR.INVALID_PARAMS || writeError.code, writeError.message, writeError);
    }
  }

  return error(500, 'fetchContractData');
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
    return error(ERROR.METAMASK_IS_NOT_INSTALLED, 'Please install Metamask');
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
    return error(ERROR.USER_REJECT, e.msg);
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
        return error(ERROR.USER_REJECT, requestAddChain.msg);
      }
      store.commit('main/resetConnection');
      return error(ERROR.USER_REJECT, requestSwitch.msg);
    }
    if (requestSwitch.code === ERROR.USER_REJECT) {
      return error(ERROR.USER_REJECT, requestSwitch.msg);
    }
  }

  store.commit('main/setIsDefaultChainId', chainId.toUpperCase() === networkData.chainId.toUpperCase());
  return output();
};

import Web3 from 'web3';
import {
  convertFromTupleToString, error, isTuple, output, isMap, convertFromMapToArray,
} from '~/utils/index';

const { WQ_PROVIDER } = process.env;

let web3;

const connectProvider = async () => {
  const isListening = await web3?.eth?.net?.isListening() || false;
  if (isListening) return web3;
  web3 = new Web3();
  try {
    const provider = new Web3.providers.HttpProvider(WQ_PROVIDER);
    web3.setProvider(provider);
    return web3;
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

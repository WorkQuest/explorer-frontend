import Web3 from 'web3';
import { error, output } from '~/utils/index';

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
  console.log('abi: ', abi);
  console.log('address: ', address);
  console.log('method: ', method);
  console.log('params: ', params);
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
    console.log('response:', response);
    return output(Array.isArray(response) ? response : [response]);
  } catch (e) {
    console.log('error: ', e);
    return error(500, 'readContractData', e);
  }
};

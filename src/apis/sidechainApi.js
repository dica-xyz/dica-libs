import { createTransaction } from '../utils/blockchain/transaction';
import blockchainConstants from '../utils/blockchain/constants';
import { TransactionTypes } from '../utils/blockchain/transactionTypes';
import httpUtil from './util';

const { fees } = blockchainConstants;

const SidechainApi = (options) => {
    const getApiPath = () => `/api/sidechains`;

    const addSidechain = async (params) => {
        const { sidechain, secret, secondSecret } = params;
        let trs = {
            type: TransactionTypes.SIDECHAIN,
            amount: 0,
            secret,
            secondSecret,
            fee: fees[TransactionTypes.SIDECHAIN],
            asset: {
                sidechain
            }
        };
        trs = await createTransaction(trs);

        return httpUtil(options).put(`${getApiPath()}`, { trs });
    };
    // search sidechain id, name, url and description
    const search = (value) => httpUtil(options).post(`${getApiPath()}/search`, { value });

    /** Get sidechain info by sidechain id */
    const getSidechainById = (id) => httpUtil(options).get(`${getApiPath()}/getById?id=${id}`);

    /** Get sidechains by creator */
    const getByAddress = (address) => httpUtil(options).get(`${getApiPath()}/getByAddress?address=${address}`);

    const getSubscribedSidechain = () => httpUtil(options).get(`${getApiPath()}/subscribed`);

    const getSubscribers = (id) => httpUtil(options).get(`${getApiPath()}/subscribers?id=${id}`);

    return {
        search,
        addSidechain,
        getSidechainById,
        getByAddress,
        getSubscribedSidechain,
        getSubscribers
    };
};
export default SidechainApi;
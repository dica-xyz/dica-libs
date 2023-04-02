import httpUtil from './util';
import { createTransaction } from '../utils/blockchain/transaction';
import { TransactionTypes } from '../utils/blockchain/transactionTypes';
import constants from '../utils/blockchain/constants';

const { fees } = constants;

const FollowApi = (options) => {

    const getApiPath = () => `/api/follows`;

    const getNumberOfFollowers = (address) => httpUtil(options).get(`${getApiPath()}/getNumberOfFollowers?address=${address}`);

    const hasFollowed = (params) => httpUtil(options).get(`${getApiPath()}/hasFollowed?address=${params.address}&author=${params.author}`);

    const following = async (params) => {
        const { secret, recipientId } = params;
        const trs = await createTransaction({
            type: TransactionTypes.FOLLOWING,
            amount: 0.5 * 10 ** 8,
            secret,
            recipientId,
            fee: fees[TransactionTypes.FOLLOWING],
        });

        return httpUtil(options).put(`${getApiPath()}/following`, { trs });
    };
    const getFollowers = (address) => httpUtil(options).get(`${getApiPath()}/getFollowers?address=${address}`);
    const getFollowees = (address) => httpUtil(options).get(`${getApiPath()}/getFollowees?address=${address}`);

    return {
        getNumberOfFollowers,
        getFollowers,
        getFollowees,
        hasFollowed,
        following
    };
};
export default FollowApi;
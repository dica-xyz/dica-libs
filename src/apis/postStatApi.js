import { createTransaction } from '../utils/blockchain/transaction';
import blockchainConstants from '../utils/blockchain/constants';
import { TransactionTypes } from '../utils/blockchain/transactionTypes';
import httpUtil from './util';

const { fees } = blockchainConstants;

const PostStatApi = (options) => {
    const getApiPath = () => `/api/postStat`;

    const deleteFavPostById = async (params) => {
        const { postId, secret } = params;
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    postId,
                }
            }
        });
        return httpUtil(options).post(`${getApiPath()}/deleteFav`, { trs });
    };

    const statIt = async (params) => {
        const {
            parentId, author, sidechainId,
            secret, secondSecret, type
        } = params;

        let trs = {
            type,
            recipientId: author.address,
            sidechainId,
            secret,
            secondSecret,
            asset: {
                postStat: {
                    parentId
                }
            }
        };

        trs = await createTransaction(trs);
        return httpUtil(options).put(`${getApiPath()}/stat`, { trs });
    };

    const tipIt = async (params) => {
        const {
            parentId, author, type, sidechainId,
            secret, amount, secondSecret
        } = params;

        let trs = {
            type,
            amount, // sidechain amount ignored
            fee: fees[TransactionTypes.SIDECHAINTX],
            recipientId: author.address,
            sidechainId,
            secret,
            secondSecret,
            asset: {
                postStat: {
                    parentId
                }
            }
        };
        trs = await createTransaction(trs);
        return httpUtil(options).put(`${getApiPath()}/stat`, { trs });
    };

    const saveFav = async (params) => {
        const {
            postId, secret
        } = params;
        let trs = {
            type: TransactionTypes.PARAMETER,
            amount: 0,
            recipientId: null,
            secret,
            fee: 0,
            asset: {
                params: { postId }
            }
        };

        trs = await createTransaction(trs);
        return httpUtil(options).put(`${getApiPath()}/saveFav`, { trs });
    };

    const statInfo = async (params) => httpUtil(options).post(`${getApiPath()}/statInfo`, params);

    return {
        statIt,
        tipIt,
        statInfo,
        saveFav,
        deleteFavPostById
    };
};
export default PostStatApi;
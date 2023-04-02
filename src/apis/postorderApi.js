import httpUtil from './util';
import { createTransaction } from '../utils/blockchain/transaction';
import { TransactionTypes, combineTransactionTypes } from '../utils/blockchain/transactionTypes';
import constants from '../utils/blockchain/constants';

const { fees } = constants;

const PostOrderApi = (options) => {
    const getApiPath = () => `/api/postorders`;

    /**
     * Purchase paid post
     * 
     * @param {object} param 
     * @returns 
     */
    const placePostOrder = async (params) => {
        const {
            amount, recipientId, secret, commission, publication,
            sidechainId, secondSecret, postId, origin
        } = params;
        const publicationCommission = amount * (commission / 100);

        const trs = await createTransaction({
            type: combineTransactionTypes(TransactionTypes.BATCHSEND, TransactionTypes.POSTORDER),
            fee: fees[TransactionTypes.BATCHSEND],
            amount,
            secret,
            secondSecret,
            sidechainId,
            asset: {
                postorder: {
                    postId
                },
                batch: [
                    { recipientId, amount: amount - publicationCommission },
                    { recipientId: publication, amount: publicationCommission }
                ]
            }
        });

        return httpUtil(options).put(`${origin}/api/postorders/`, { trs });
    };

    const getPaidPost = async (params, origin) => {
        const {
            recipientId, secret, secondSecret, postId,
        } = params;
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            recipientId,
            secret,
            secondSecret,
            fee: fees[TransactionTypes.PARAMETER],
            asset: {
                params: {
                    postId,
                },
            },
        });

        return httpUtil(options).post(`${origin}/api/postorders/`, { trs });
    };

    const getPurchaseHistory = (address) => httpUtil(options).get(`${getApiPath()}/history?address=${address}`);

    return {
        placePostOrder,
        getPaidPost,
        getPurchaseHistory
    };
};
export default PostOrderApi;

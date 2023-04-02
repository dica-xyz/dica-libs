/* eslint-disable no-nested-ternary */
import { createTransaction } from '../utils/blockchain/transaction';
import storageApi from './storageApi';
import { TransactionTypes } from '../utils/blockchain/transactionTypes';
import httpUtil from './util';

const ShortApi = (options) => {
    const getApiPath = () => `/api/shorts`;

    /**
     *Create post transaction
     *
     * @param {*} param
     * @returns transaction data
     */
    const createShortTransaction = async (params) => {
        const {
            post, fileHash, secret, secondSecret, sidechainId
        } = params;
        const {
            tags, options, postId
        } = post;

        let trs = {
            type: TransactionTypes.POST,
            amount: 0,
            secret,
            secondSecret,
            sidechainId,
            asset: {
                post: {
                    postId,
                    tags,
                    options,
                    content: fileHash
                }
            }
        };
        trs = await createTransaction(trs);
        return trs;
    };

    /**
     * Publish new post to blockchain directly, paid by author.
     * 
     * @param {object} param 
     * @returns 
     */
    const broadcast = async (transaction) => {
        const { post } = transaction;

        const fileHash = await storageApi(options).getFileHash({ file: post, onlyHash: true, pin: false });
        if (!fileHash) {
            throw new Error('Unable to generate file hash');
        }
        // Create post transaction
        const shortTransaction = await createShortTransaction({ ...transaction, fileHash });

        // Submit all transactions 
        return httpUtil(options).put(`${getApiPath()}/broadcast`, {
            post,
            trs: shortTransaction
        });
    };

    /**
     * Save a copy to local database
     * Local post can not be paid post because post id does not exist in blockchain,
     * so purchase order can't be created
     * @param {*} param
     */
    const saveToLocal = async ({ post, secret }) => {
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    post
                }
            },
        });

        return httpUtil(options).put(`${getApiPath()}`, { trs });
    };

    return {
        saveToLocal,
        broadcast
    };
};
export default ShortApi;

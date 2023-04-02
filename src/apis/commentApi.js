/* eslint-disable no-nested-ternary */
import { createTransaction, getSidechainTx } from '../utils/blockchain/transaction';
import storageApi from './storageApi';
import { TransactionTypes } from '../utils/blockchain/transactionTypes';
import httpUtil from './util';

const CommentApi = (options) => {
    const getApiPath = () => `/api/comments`;

    /**
     * Save draft to local database
     *
     * @param {*} param
     */
    const saveComment = async (params) => {
        const {
            parentId, body, commentId, secret,
        } = params;
        let trs = {
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    commentId,
                    parentId,
                    content: {
                        body,
                        format: 'text',
                    }
                }
            }
        };
        trs = await createTransaction(trs);
        return httpUtil(options).put(`${getApiPath()}/local`, { trs });
    };

    /**
     *Create comment transaction
     *
     * @param {*} param
     * @returns transaction data
     */
    const createCommentTransaction = async (params) => {
        const {
            content, secret, secondSecret,
            fileHash, sidechainId
        } = params;
        const {
            author, parentId, commentId
        } = content;

        const sidechainTx = await getSidechainTx(sidechainId, TransactionTypes.POSTCOMMENT);
        let trs = {
            type: TransactionTypes.POSTCOMMENT,
            recipientId: author,
            amount: sidechainTx?.amount ?? 0,
            secret,
            secondSecret,
            sidechainId,
            sidechainFee: sidechainTx?.fee ?? 0,
            asset: {
                comment: {
                    commentId,
                    author,
                    parentId,
                    content: fileHash
                }
            }
        };
        trs = await createTransaction(trs);
        return trs;
    };

    /**
     * Broadcast comment to blockchain
     *
     * @param {*} param
     */
    const broadcast = async (params) => {
        const {
            body, author, commentId, parentId
        } = params;
        const content = {
            body,
            author,
            format: 'text',
            parentId,
            commentId
        };
        const fileHash = await storageApi(options).getFileHash({ file: content, onlyHash: false, pin: true });
        if (!fileHash) {
            throw new Error('Unable to generate file hash');
        }
        // Create post transaction
        const trs = await createCommentTransaction({ ...params, fileHash, content });
        // Submit all transactions 
        return httpUtil(options).put(`${getApiPath()}/broadcast`, {
            content,
            trs
        });
    };

    /**
     * Get post comments by post id
     * 
     * @param {any} param 
     * @returns 
     */
    const getByParentId = (params) => httpUtil(options).get(`${getApiPath()}/getByParentId?id=${params}`);

    const toggleComment = async ({ commentId, status, parentId, secret }) => {
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    parentId,
                    commentId,
                    status
                }
            }
        });
        return httpUtil(options).post(`${getApiPath()}/toggle`, { trs });
    };

    return {
        getByParentId,
        saveComment,
        broadcast,
        toggleComment,
    };

};
export default CommentApi;
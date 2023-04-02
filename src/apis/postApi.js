/* eslint-disable no-nested-ternary */
import { createTransaction } from '../utils/blockchain/transaction';
import storageApi from './storageApi';
import authorKeyApi from './authorKeyApi';
import { TransactionTypes } from '../utils/blockchain/transactionTypes';
import httpUtil from './util';
import { constants, shortId } from '../utils';

const PostApi = (options) => {
    const getApiPath = () => `/api/posts`;

    /**
     *Create post transaction
     *
     * @param {*} param
     * @returns transaction data
     */
    const createPostTransaction = async (params) => {
        const {
            post, fileHash, secret, secondSecret, sidechainId
        } = params;
        const {
            title, tags, options, postId
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
                    title,
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
        const { post, postPublicKey, secret } = transaction;
        // Create author key transaction if set
        let authorKeyTransaction;
        if (post.options.payment?.price > 0) {
            // TODO: need to handle if register key fails.
            if (!postPublicKey) {
                throw new Error('Paid post needs key pair to encrypt content. Please go to profile page and generate a pair of keys.');
            }
            authorKeyTransaction = await authorKeyApi(options).CreateAuthorKeyTransaction({
                keyName: post.options.payment.keyName,
                publicKey: postPublicKey,
                secret
            });
        }
        const fileHash = await storageApi(options).getFileHash({ file: post, onlyHash: true, pin: false });
        if (!fileHash) {
            throw new Error('Unable to generate file hash');
        }
        // Create post transaction
        const postTransaction = await createPostTransaction({ ...transaction, fileHash, post });

        // Submit all transactions 
        return httpUtil(options).put(`${getApiPath()}/broadcast`, {
            post,
            trs: postTransaction,
            authorKeyTransaction
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

        return httpUtil(options).put(`${getApiPath()}${post.status === constants.PostStatus.DRAFT ? '/draft' : ''}`, { trs });
    };

    /**
     * Search posts by keyword, address
     * 
     * @param {any} param 
     * @returns 
     */
    const search = (params) => httpUtil(options).post(`${getApiPath()}/search`, params);

    /**
     * Get posts by address and status
     * 
     * @param {any} param 
     * @returns 
     */
    const getPostsByAuthorStatus = async (params) => {
        const {
            status, limit, offset, secret, author
        } = params;
        let _secret = secret;
        if (!_secret) {
            _secret = shortId(); // if user secret is not assigned, create a random user secret
        }
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret: _secret,
            fee: 0,
            asset: {
                params: {
                    author, status, limit, offset,
                }
            }
        });
        return httpUtil(options).post(`${getApiPath()}/getPostsByAuthorStatus`, { trs });
    };

    const deletePostById = async (params) => {
        const { postId, secret, status } = params;
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    postId, status
                }
            }
        });
        return httpUtil(options).post(`${getApiPath()}/delete`, { trs });
    };

    /**
     * Get draft by id. Only author can get his own drafts.
     *
     * @param {*} param
     * @returns
     */
    const getDraftById = async (params) => {
        const { postId, status, secret } = params;
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    postId,
                    status
                }
            }
        });
        return httpUtil(options).post(`${getApiPath()}/getDraftById`, { trs });
    };

    /**
     * Get post by post ID
     * 
     * @param {any} param 
     * @returns 
     */
    const getById = (postId, options) => httpUtil(options).post(`${getApiPath()}/getById`, { postId, options });


    // get post's view counts
    const getViewCounts = (postId) => {
        try {
            return httpUtil(options).get(`/da/apis/posts/getViewCounts?postId=${postId}`);
            // eslint-disable-next-line no-console
        } catch (error) { return { success: false, count: 0 }; }
    };

    return {
        broadcast,
        search,
        getById,
        getDraftById,
        getPostsByAuthorStatus,
        saveToLocal,
        deletePostById,
        getViewCounts
    };
};
export default PostApi;

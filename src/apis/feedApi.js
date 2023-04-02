import httpUtil from './util';
import { createTransaction } from '../utils/blockchain/transaction';
import { TransactionTypes } from '../utils/blockchain/transactionTypes';

const feedApi = (options) => {
    const getApiPath = () => `/api/feeds`;

    /**
     * Get posts by feed id
     * 
     * @param {any} param 
     * @returns 
     */
    const getPostsByFeedId = (params) => {
        return httpUtil(options).post(`${getApiPath()}`, params);
    }

    const getFeedsByPostId = async (params) => {
        const { secret, postId } = params;
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: { postId },
            },
        });

        return httpUtil(options).post(`${getApiPath()}/getFeedsByPostId`, { trs });
    };
    /**
     * After publishing, author can manage post with feeds if author is a publication.
     *
     * @param {*} params
     * @returns
     */
    const savePostToFeeds = async (params) => {
        const {
            secret, postId, feedIds, status
        } = params;

        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: { postId, feedIds, status }
            }
        });
        return httpUtil(options).post(`${getApiPath()}/savePostToFeeds`, { trs });
    };
    return {
        getPostsByFeedId,
        getFeedsByPostId,
        savePostToFeeds,
    };
}
export default feedApi;
import httpUtil from './util';
import { TransactionTypes } from '../utils/blockchain/transactionTypes';
import { createTransaction } from '../utils/blockchain/transaction';

const PublicationApi = (options) => {

    const getApiPath = () => '/api/publications';

    const search = (params) => httpUtil(options).post(`${getApiPath()}/search`, params);

    const getFavorites = (address) => httpUtil(options).get(`${getApiPath()}/getFavorites?address=${address}`);

    const addToFavorites = async (params) => {
        const { publication, secret } = params;
        if (!secret) {
            throw new Error('Secret is required');
        }

        if (!publication) {
            throw new Error('publication is required');
        }
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    publication
                }
            }
        });
        return httpUtil(options).post(`${getApiPath()}/addToFavorites`, { trs });
    };

    const removeFromFavorites = async (params) => {
        const { publication, secret } = params;
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    publication
                }
            }
        });
        return httpUtil(options).post(`${getApiPath()}/removeFromFavorites`, { trs });
    }

    return {
        search,
        getFavorites,
        addToFavorites,
        removeFromFavorites
    }
};

export default PublicationApi;
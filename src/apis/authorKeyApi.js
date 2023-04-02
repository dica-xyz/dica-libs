import { createTransaction } from '../utils/blockchain/transaction';
import { TransactionTypes } from '../utils/blockchain/transactionTypes';
import httpUtil from './util';

const AuthorKeyApi = (options) => {
    const getApiPath = () => `/api/keys`;

    /** */
    const CreateAuthorKeyTransaction = async (params) => {
        const {
            keyName, publicKey, secret,
        } = params;

        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    keyName,
                    publicKey
                }
            }
        });
        return trs;
    };

    const registerKey = (params) => {
        const trs = CreateAuthorKeyTransaction(params);
        return httpUtil(options).put(`${getApiPath()}/`, { trs });
    };

    const deleteKey = (params) => {
        const { keyName, address, secret } = params;
        const trs = createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    keyName, address,
                },
            },
        });
        return httpUtil(options).post(`${getApiPath()}/delete`, { trs });
    };
    return {
        registerKey, CreateAuthorKeyTransaction, deleteKey
    };
};

export default AuthorKeyApi;
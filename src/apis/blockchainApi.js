import Bignum from "browserify-bignum";
import httpUtil from './util';
import { createTransaction } from '../utils/blockchain/transaction';
import { TransactionTypes } from '../utils/blockchain/transactionTypes';
import storageApi from './storageApi';
import constants from '../utils/blockchain/constants';

const { fees } = constants;

const BlockchainApi = (options) => {

    const getApiPath = () => `/api`;

    const send = async ({
        amount, recipientId, secret, secondSecret
    }) => {
        const trs = await createTransaction({
            type: TransactionTypes.SEND,
            amount,
            recipientId,
            fee: fees[TransactionTypes.SEND],
            secret,
            secondSecret,
        });
        return httpUtil(options).put(`${getApiPath()}/transactions`, trs);
    };

    const batchSend = async ({
        batch, secret, secondSecret,
    }) => {
        if (!batch || batch.length === 0) {
            // eslint-disable-next-line no-throw-literal
            throw 'Batch asset can not be empty';
        }
        let amount = new Bignum(0);
        amount = batch.reduce((a, b) => (new Bignum(b.amount)).plus(a), amount);

        const trs = await createTransaction({
            type: TransactionTypes.BATCHSEND,
            amount: Number(amount.toFixed()),
            fee: fees[TransactionTypes.BATCHSEND],
            asset: { batch },
            secret,
            secondSecret,
        });
        return httpUtil(options).put(`${getApiPath()}/transactions`, trs);
    };

    const getBlocks = (params) => httpUtil(options).get(`${getApiPath()}/blocks?
orderBy=${(params.orderBy ? params.orderBy : 'height:desc')}
&limit=${params.limit}
&offset=${params.offset}
${params.sidechainId ? `&sidechainId=${params.sidechainId}` : ''}`);

    const getTransactions = (params) => httpUtil(options).get(
        `${getApiPath()}/transactions?orderBy=${(params.orderBy ? params.orderBy : 'rowId:desc')}`
        + `&limit=${params.limit}&offset=${params.offset}`
        + `${params.blockId ? `&and:blockId=${params.blockId}` : ''}`
        + `${params.type !== undefined ? `&and:type=${params.type}` : ''}`
        + `${params.address ? `&senderId=${params.address}` : ''}`
        + `${params.address ? `&recipientId=${params.address}` : ''}`
        + `${params.publicKey ? `&sponsorPublicKeys=${params.publicKey}` : ''}`
        + `${params.sidechainId ? `&and:sidechainId=${params.sidechainId}` : ''}`
    );

    const getBlock = (blockId, sidechainId) => httpUtil(options).get(`${getApiPath()}/blocks/get?id=${blockId}${sidechainId ? `&sidechainId=${sidechainId}` : ''}`);

    const getTransaction = (id, sidechainId) => httpUtil(options).get(`${getApiPath()}/transactions/get?id=${id}${sidechainId ? `&sidechainId=${sidechainId}` : ''}`);

    const registerPublication = async (params) => {
        const {
            username, payout, profile, secret, secondSecret,
        } = params;
        let profileHash;
        if (profile) {
            profileHash = await storageApi(options).getFileHash({
                file: profile, onlyHash: false, pin: false,
            });
        }

        const trs = await createTransaction({
            type: TransactionTypes.DELEGATE,
            amount: 0,
            secret,
            secondSecret,
            fee: fees[TransactionTypes.DELEGATE],
            asset: {
                delegate: {
                    username,
                    payout,
                    profile: profileHash
                }
            },
        });

        return httpUtil(options).put(`${getApiPath()}/delegates`, { trs, profile });
    };

    const getDelegates = (params) => {
        const limit = params && params.limit ? `&limit=${params.limit}` : '';
        const offset = params && params.offset ? `&offset=${params.offset}` : '';
        const sidechainId = params && params.sidechainId ? `&sidechainId=${params.sidechainId}` : '';
        return httpUtil(options).get(`${getApiPath()}/delegates?orderBy=rate:asc${limit}${offset}${sidechainId}`);
    };

    const getDelegateByAddress = (params) => {
        const { address, limit, offset } = params;

        return httpUtil(options).post(`${getApiPath()}/delegates/getByAddress`, {
            address,
            orderBy: 'timestamp:desc',
            limit,
            offset: offset * limit,
        });
    };
    return {
        send,
        batchSend,
        getBlocks,
        getTransactions,
        getBlock,
        getTransaction,
        registerPublication,
        getDelegates,
        getDelegateByAddress
    };
};
export default BlockchainApi;
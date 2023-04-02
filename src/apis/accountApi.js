import httpUtil from './util';
import { createTransaction } from '../utils/blockchain/transaction';
import { TransactionTypes } from '../utils/blockchain/transactionTypes';
import constants from '../utils/blockchain/constants';
import EncryptionHelper from '../utils/encryptionHelper';
import crypto from '../utils/blockchain/crypto';

const { fees } = constants;

const AccountApi = (options) => {

    const getApiPath = () => `/api/accounts`;

    const getAccount = async (address) => {
        const res = await httpUtil(options).post(`${getApiPath()}/getAccount`, { address });
        let data = res?.data;
        if (data?.success && data?.data) {
            let balance = Number(data.data.balance);
            if (Number.isNaN(balance)) { balance = 0; }
            data = { ...data.data, balance };
            return data;
        }
        return null;
    };

    const getVotes = (address) => httpUtil(options).get(`${getApiPath()}/votes?address=${address}`);

    const addVotes = async (params) => {
        const { secret, secondSecret, asset } = params;
        const trs = await createTransaction({
            type: TransactionTypes.VOTE,
            amount: 0,
            secret,
            secondSecret,
            fee: fees[TransactionTypes.VOTE],
            asset,
        });

        return httpUtil(options).put(`${getApiPath()}/votes`, trs);
    };

    /** User register email and can  use email later to log in */
    const registerUser = async (params) => {
        const {
            address, wallet, password, email,
        } = params;
        const keyIV = EncryptionHelper.getKeyAndIV(password); // using 32 byte key
        const encryptedWallet = EncryptionHelper.encryptTextAES(keyIV, JSON.stringify(wallet));
        const hashedPassword = EncryptionHelper.getHash(password).toString('hex');
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret: wallet.secret,
            fee: 0,
            asset: {
                params: {
                    address,
                    email,
                    password: hashedPassword,
                    wallet: { value: encryptedWallet, iv: keyIV.iv.toString('hex') },
                },
            },
        });

        return httpUtil(options).put(`${getApiPath()}/register/local`, { trs });
    };

    /** Allow registered user to remove its account */
    const deleteUser = async (params) => {
        const { secret } = params;

        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {},
            },
        });

        return httpUtil(options).post(`${getApiPath()}/delete`, { trs });
    };

    /** Registered user to use email and password to login */
    const localLogin = async ({ email, password }) => {
        const hashedPassword = EncryptionHelper.getHash(password).toString('hex');
        try {
            const res = await httpUtil(options).post(`${getApiPath()}/login/local`, {
                email, password: hashedPassword,
            });
            if (res?.data?.success) {
                const wallet = res?.data.data;
                const keyIV = EncryptionHelper.getKeyAndIV(password); // using 32 byte key
                keyIV.iv = Buffer.from(wallet.iv, 'hex');
                const decryptedWallet = EncryptionHelper.decryptTextAES(keyIV, wallet.value);
                return { success: true, data: JSON.parse(decryptedWallet) };
            }
            return res?.data;
        } catch (err) {
            return null;
        }
    };
    /** User subscribe publication's updates */
    const subscribe = (params) => httpUtil(options).post(`${getApiPath()}/publication/subscribe`, params);

    /** Check whether publication exists */
    const schemaExists = (address) => {
        if (address) {
            return httpUtil(options).get(`${getApiPath()}/schemaExists?address=${address}`);
        }
        return { success: false, err: [{ message: `address can not be null` }] };
    };

    /** Register user's second secret */
    const registerSecondSecret = async (params) => {
        const { secret, secondSecret } = params;
        const secondKeypair = crypto.getKeys(secondSecret);

        const trs = await createTransaction({
            type: TransactionTypes.SIGNATURE,
            amount: 0,
            secret,
            fee: constants.fees[TransactionTypes.SIGNATURE],
            asset: {
                signature: {
                    publicKey: secondKeypair.publicKey,
                },
            },
        });
        return httpUtil(options).put(`/api/signatures`, trs);
    };

    /** Check whether user has subscribed the author */
    const hasSubscribed = (params) => httpUtil(options).get(`${getApiPath()}/author/hasSubscribed?address=${params.address}&author=${params.author}`);
    /** Subscribe author's update */
    const subscribeAuthor = async (params) => {
        const {
            secret, email, author,
        } = params;
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    email, author
                },
            },
        });
        return httpUtil(options).post(`${getApiPath()}/author/subscribe`, { trs });
    };
    /** Unsubscribe author's update */
    const unSubscribeAuthor = async (params) => {
        const {
            secret, author,
        } = params;
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    author
                }
            }
        });
        return httpUtil(options).post(`${getApiPath()}/author/unsubscribe`, { trs });
    };

    /** create publication schema */
    const createPublication = async (params) => {
        const { secret, token } = params;
        const trs = await createTransaction({
            type: TransactionTypes.PARAMETER,
            amount: 0,
            secret,
            fee: 0,
            asset: {
                params: {
                    token
                }
            }
        });
        return httpUtil(options).put(`${getApiPath()}/publication`, { trs });
    };
    return {
        getAccount,
        getVotes,
        addVotes,
        registerUser,
        localLogin,
        deleteUser,
        subscribe,
        schemaExists,
        registerSecondSecret,
        hasSubscribed,
        subscribeAuthor,
        unSubscribeAuthor,
        createPublication
    };
};
export default AccountApi;

import Bignum from "browserify-bignum";
import httpUtil from './util';
import { createTransaction } from '../utils/blockchain/transaction';
import { TransactionTypes } from '../utils/blockchain/transactionTypes';
import storageApi from './storageApi';
import constants from '../utils/blockchain/constants';

const GiveawayApi = (options) => {
    const getApiPath = () => `/api/giveaways`;

    /**
     * Post new giveaway to blockchain
     * 
     * @param {object} params 
     * @returns 
     */
    const newGiveAway = async (params) => {
        const {
            giveawayId, secret, secondSecret, amount, featureImage, title, description,
            startTimestamp, endTimestamp, totalAmount, origin
        } = params;
        const bounty = {
            giveawayId,
            amount,
            featureImage,
            title,
            description,
            startTimestamp,
            endTimestamp,
            totalAmount,
            origin
        };
        const fileHash = await storageApi(options).getFileHash({
            file: bounty,
            onlyHash: true,
            pin: false,
        });
        if (!fileHash) {
            throw new Error('Unable to generate bounty file hash');
        }

        const trs = await createTransaction({
            type: TransactionTypes.GIVEAWAY,
            fee: constants.fees[TransactionTypes.GIVEAWAY],
            amount: 0,
            secret,
            secondSecret,
            asset: {
                giveAway: {
                    giveawayId,
                    amount,
                    title,
                    content: fileHash,
                    startTimestamp,
                    endTimestamp,
                    totalAmount,
                    origin
                }
            }
        });
        return httpUtil(options).put(`${getApiPath()}`, { trs, bounty });
    };
    /**
     * Get all giveaways
     * 
     * @param {any} param 
     * @returns 
     */
    const getGiveAways = (senderId) => httpUtil(options).get(`${getApiPath()}/${senderId ? `?senderId=${senderId}` : ''}`);/**
 * Get giveaway by ID
 * 
 * @param {any} param 
 * @returns 
 */
    const getGiveawayById = (id) => httpUtil(options).get(`${getApiPath()}/getGiveawayById?id=${id}`);

    const getRequestsByRecipientId = (params) => httpUtil(options).get(`${getApiPath()}/getRequestsByRecipientId?recipientId=${params}`);

    const getRandomPicks = (params) => httpUtil(options).get(`${getApiPath()}/getRandomPicks?id=${params}`);

    const newGiveAwayRequest = async (params) => {
        const {
            secret, giveawayId, response
        } = params;
        const request = {
            giveawayId,
            response
        };
        const fileHash = await storageApi.getFileHash({
            file: request,
            onlyHash: true,
            pin: false,
        });
        if (!fileHash) {
            throw new Error('Unable to generate bounty request file hash');
        }

        const trs = await createTransaction({
            type: TransactionTypes.GIVEAWAYREQUEST,
            fee: constants.fees[TransactionTypes.GIVEAWAYREQUEST],
            secret,
            asset: {
                giveAwayRequest: {
                    giveawayId,
                    response: {
                        ...response,
                        content: fileHash,
                        ip: request.response.ip,
                    },
                },
            },
        });
        return httpUtil(options).put(`${getApiPath()}/request`, { trs, request });
    };

    const approveGiveAwayRequests = async (params) => {
        const {
            transactions, secret, secondSecret
        } = params;
        if (transactions?.length) {
            let amount = new Bignum(0);
            amount = transactions.reduce((a, b) => (new Bignum(b.amount)).plus(a), amount);

            const trs = await createTransaction({
                type: TransactionTypes.GIVEAWAYAPPROVEDREQUEST,
                fee: constants.fees[TransactionTypes.GIVEAWAYAPPROVEDREQUEST],
                amount: Number(amount.toFixed()),
                secret,
                secondSecret,
                asset: {
                    approved: transactions
                }
            });

            return httpUtil(options).put(`${getApiPath()}/approve`, { trs });
        }
        throw new Error('No request selected');
    };

    return {
        newGiveAway,
        getGiveAways,
        getGiveawayById,
        getRequestsByRecipientId,
        newGiveAwayRequest,
        getRandomPicks,
        approveGiveAwayRequests
    };
};
export default GiveawayApi;
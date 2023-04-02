import { TransactionTypes } from './transactionTypes';

export default {
    totalAmount: 10000000000000000,
    fixedPoint: 10 ** 8,
    epochTime: new Date(Date.UTC(2022, 1, 2, 20, 0, 0, 0)),
    fees: {
        [TransactionTypes.SEND]: 1 * 10 ** 8,
        [TransactionTypes.BATCHSEND]: 1 * 10 ** 8,
        [TransactionTypes.VOTE]: 1 * 10 ** 8,
        [TransactionTypes.FOLLOWING]: 0.5 * 10 ** 8,
        [TransactionTypes.SIGNATURE]: 5 * 10 ** 8,
        [TransactionTypes.DELEGATE]: 25 * 10 ** 8,
        [TransactionTypes.MULTI]: 5 * 10 ** 8,
        [TransactionTypes.SIDECHAIN]: 50 * 10 ** 8,
        [TransactionTypes.SIDECHAINTX]: 0.1 * 10 ** 8,
        [TransactionTypes.GIVEAWAY]: 10 * 10 ** 8,
        [TransactionTypes.GIVEAWAYREQUEST]: 0,
        [TransactionTypes.GIVEAWAYAPPROVEDREQUEST]: 1 * 10 ** 8,
        [TransactionTypes.PARAMETER]: 0
    }
};

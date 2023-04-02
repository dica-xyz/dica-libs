const TransactionTypes = {
    SEND: 0,
    SIGNATURE: 1,
    DELEGATE: 2,
    VOTE: 3,
    MULTI: 4,
    FOLLOWING: 5,
    SIDECHAIN: 6,
    SIDECHAINTX: 7,
    BATCHSEND: 8,
    PARAMETER: 10,
    /** Giveaway Transactions Types */
    GIVEAWAY: 20,
    GIVEAWAYREQUEST: 21,
    GIVEAWAYAPPROVEDREQUEST: 22,
    /** ACCOUNTTYPE */
    ACCOUNTTYPE: 101,
    /** Sidechain Delegate */
    SIDECHAIN_DELEGATE: 102,
    /** SIDECHAIN MANAGEMENT */
    SUBSCRIBER: 110,
    /** POST Transaction Types */
    POST: 150,
    POSTLIKE: 151,
    POSTDISLIKE: 152,
    POSTTIP: 153,
    POSTCOMMENT: 154,
    POSTORDER: 155
};

const getTransactionNameByValue = (value) => {
    let type = Number(value);
    if (type > 2 ** 10) {
        type >>= 10;
    }
    return Object.keys(TransactionTypes).find((key) => TransactionTypes[key] === type);
};

// eslint-disable-next-line no-mixed-operators
const combineTransactionTypes = (mainchainType, sidechainType) => sidechainType << 10 | mainchainType;

export { TransactionTypes, getTransactionNameByValue, combineTransactionTypes };
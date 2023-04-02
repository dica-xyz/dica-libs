import crypto from './crypto';
import slots from './slots';
import constants from './constants';
import httpUtil from '../../apis/util';
import { TransactionTypes } from './transactionTypes';

const { fees } = constants;

const getApiPath = () => `/api/sidechains`;

// Remove those props whose value are null or undefined.
// Only process the 2nd level object
const deleteEmptyProps = (obj) => {
    if (!obj) return obj;
    Object.keys(obj).forEach((p) => {
        if (obj[p] === null) {
            // eslint-disable-next-line no-param-reassign
            delete obj[p];
        } else if (typeof obj[p] === 'object') {
            deleteEmptyProps(obj[p]);
        }
    });
    return obj;
};

/**
 * Get data of sidechain transaction
 *
 * @param {*} sidechainId
 * @param {*} type
 * @returns
 */
const getSidechainTx = async (sidechainId, type) => {
    const res = await httpUtil.get(`${getApiPath()}/getSidechainTx?sidechainId=${sidechainId}&type=${type}`);
    if (res?.data?.success) {
        return res.data.data;
    }
    throw new Error(`Unable to get sidechain transaction's data. ${JSON.stringify(res?.data?.err)}`);
};

const createTransaction = async (trs) => {
    const {
        type, amount, recipientId, asset,
        secret, secondSecret, fee, sidechainId
    } = trs;

    let sidechainTx;
    if (sidechainId && type < 100) {
        throw new Error('Sidechain id has to be null for mainchain transaction');
    }

    if (sidechainId && type > 101) {
        // sidechain transactions
        sidechainTx = await getSidechainTx(sidechainId, type);
    }

    const transaction = {
        id: crypto.getId(),
        type,
        amount: amount ?? sidechainTx?.amount ?? 0,
        recipientId,
        timestamp: slots.getTime(),
        fee: fee || ((sidechainTx?.fee > 0 || amount > 0) ? fees[TransactionTypes.SIDECHAINTX] : 0),
        sidechainId,
        sidechainFee: sidechainTx?.fee ?? 0,
        asset: deleteEmptyProps(asset) || {}
    };

    const keys = crypto.getKeys(secret);
    transaction.senderPublicKey = keys.publicKey;
    transaction.senderId = crypto.getAddress(keys.publicKey);
    // sign sidechain transaction
    if (transaction.sidechainId) {
        // signature for sidechain, with asset bytes
        transaction.sidechainSignature = crypto.sign(transaction, keys, true);

        if (secondSecret) {
            const secondKeys = crypto.getKeys(secondSecret);
            transaction.sidechainSignSignature = crypto.secondSign(transaction, secondKeys, true);
        }

        // signature for mainchain, without asset bytes
        transaction.signature = crypto.sign(transaction, keys);

        if (secondSecret) {
            const secondKeys = crypto.getKeys(secondSecret);
            transaction.signSignature = crypto.secondSign(transaction, secondKeys);
        }
    } else {
        // signature for mainchain, without asset bytes
        transaction.signature = crypto.sign(transaction, keys);

        if (secondSecret) {
            const secondKeys = crypto.getKeys(secondSecret);
            transaction.signSignature = crypto.secondSign(transaction, secondKeys);
        }
    }
    return transaction;
};

export { createTransaction, getSidechainTx };
export default { createTransaction, getSidechainTx };
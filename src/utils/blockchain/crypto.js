/* eslint-disable no-throw-literal */
import crypto from "crypto-browserify";
import ByteBuffer from "bytebuffer";
import Mnemonic from 'bitcore-mnemonic';
import Bignum from "browserify-bignum";
import nacl from "tweetnacl";
import { v4 } from 'uuid';
import { TransactionTypes } from "./transactionTypes";

/**
 * Convert buffer to hex string
 * 
 * @returns string
 */
const ArrayBufferToHexString = (arrayBuffer) => Array.prototype.map.call(new Uint8Array(arrayBuffer), (byte) => (`0${(byte & 0xFF).toString(16)}`).slice(-2)).join('');

const getTransactionType = (type, forSidechain) => {
    if (type < 2 ** 10) return type;
    if (forSidechain) {
        // return sidechain transaction type
        return type >> 10;
    }
    // return mainchain transaction type
    return type & (2 ** 10 - 1);
};

const getBatchSendBytes = (asset) => asset
    .sort((a, b) => (
        a.recipientId === b.recipientId
            ? Number(a.amount) - Number(b.amount)
            : a.recipientId > b.recipientId ? 1 : -1
    ))
    .reduce((prev, cur) => {
        let buf;
        buf = Buffer.concat([prev, Buffer.from(cur.amount.toString(), 'utf8')]);
        buf = Buffer.concat([buf, Buffer.from(cur.recipientId, 'utf8')]);
        return buf;
    }, Buffer.from('', 'utf8'));

const getDelegateBytes = (asset) => {
    const {
        username, profile, payout
    } = asset;
    if (!username) {
        throw 'Username can not be empty';
    }
    let buf;

    buf = Buffer.from(username, 'utf8');
    if (payout) {
        buf = Buffer.concat([buf, Buffer.from(payout.toString(), 'utf8')]);
    }

    if (profile) {
        // profile is a hash only
        buf = Buffer.concat([buf, Buffer.from(profile, 'utf8')]);
    }
    return buf;
};

const getSignatureBytes = (signature) => {
    const bb = new ByteBuffer(32, true);
    const publicKeyBuffer = Buffer.from(signature.publicKey, "hex");

    for (let i = 0; i < publicKeyBuffer.length; i += 1) {
        bb.writeByte(publicKeyBuffer[i]);
    }
    bb.flip();
    return new Uint8Array(bb.toArrayBuffer());
};

const getPostBytes = (asset) => {
    const {
        content, postId, title, tags, options
    } = asset;

    // if broadcast to blockchain, content is a hash only
    // if save to local, content is an object
    let buf = Buffer.from(typeof content === 'object' ? JSON.stringify(content) : content, 'utf8');
    buf = Buffer.concat([buf, Buffer.from(postId, 'utf8')]);
    if (options.type === 0) { // short does not have title
        buf = Buffer.concat([buf, Buffer.from(title, 'utf8')]);
    }
    buf = Buffer.concat([buf, Buffer.from(options.canonicalUrl, 'utf8')]);
    buf = Buffer.concat([buf, Buffer.from(options.disableComments ? '0' : '1', 'utf8')]);
    buf = Buffer.concat([buf, Buffer.from(options.language, 'utf8')]);
    if (options.payment) {
        buf = Buffer.concat([buf, Buffer.from(options.payment.origin, 'utf8')]);
        buf = Buffer.concat([buf, Buffer.from(options.payment.price.toString(), 'utf8')]);
        buf = Buffer.concat([buf, Buffer.from(options.payment.commission.toString(), 'utf8')]);
        buf = Buffer.concat([buf, Buffer.from(options.payment.keyName, 'utf8')]);
        buf = Buffer.concat([buf, Buffer.from(options.payment.postKey, 'utf8')]);
    }

    if (tags && tags.length > 0) {
        tags.forEach((tag) => {
            buf = Buffer.concat([buf, Buffer.from(tag, 'utf8')]);
        });
    }

    return buf;
};

const getCommentBytes = (asset) => {
    const {
        content, commentId, parentId
    } = asset;

    // if broadcast to blockchain, content here is a hash only
    // if save to local, content is an object
    let buf = Buffer.from(typeof content === 'object' ? JSON.stringify(content) : content, 'utf8');
    buf = Buffer.concat([buf, Buffer.from(commentId, 'utf8')]);
    buf = Buffer.concat([buf, Buffer.from(parentId, 'utf8')]);
    return buf;
};

const getPostOrderBytes = (asset) => {
    const { postId } = asset.postorder;
    const { batch } = asset;
    return batch
        .sort((a, b) => (
            a.recipientId === b.recipientId
                ? Number(a.amount) - Number(b.amount)
                : a.recipientId > b.recipientId ? 1 : -1
        ))
        .reduce((prev, cur) => {
            let buf;
            buf = Buffer.concat([prev, Buffer.from(cur.amount.toString(), 'utf8')]);
            buf = Buffer.concat([buf, Buffer.from(cur.recipientId, 'utf8')]);
            return buf;
        }, Buffer.from(postId, 'utf8'));
};

const getGiveAwayBytes = (asset) => {
    const {
        giveawayId, amount, title, content, origin,
        startTimestamp, endTimestamp, totalAmount
    } = asset;

    let buf = Buffer.from(amount.toString(), 'utf8');
    buf = Buffer.concat([buf, Buffer.from(giveawayId, 'utf8')]);
    buf = Buffer.concat([buf, Buffer.from(title, 'utf8')]);
    buf = Buffer.concat([buf, Buffer.from(content, 'utf8')]);
    buf = Buffer.concat([buf, Buffer.from(startTimestamp.toString(), 'utf8')]);
    if (endTimestamp) {
        buf = Buffer.concat([buf, Buffer.from(endTimestamp.toString(), 'utf8')]);
    }
    buf = Buffer.concat([buf, Buffer.from(totalAmount.toString(), 'utf8')]);
    buf = Buffer.concat([buf, Buffer.from(origin, 'utf8')]);
    return buf;
};

const getGiveAwayRequestBytes = (asset) => {
    const { giveawayId, response } = asset;
    const { content, quantity, ip } = response;

    let buf = Buffer.from(giveawayId, 'utf8');
    buf = Buffer.concat([buf, Buffer.from(content, 'utf8')]);
    buf = Buffer.concat([buf, Buffer.from(quantity.toString(), 'utf8')]);
    buf = Buffer.concat([buf, Buffer.from(ip, 'utf8')]);
    return buf;
};

const getApprovedGiveAwayRequestBytes = (asset) => asset
    .sort((a, b) => (
        a.requestTxId > b.requestTxId ? 1 : -1
    ))
    .reduce((prev, cur) => {
        let buf;
        buf = Buffer.concat([prev, Buffer.from(cur.amount.toString(), 'utf8')]);
        buf = Buffer.concat([buf, Buffer.from(cur.recipientId, 'utf8')]);
        buf = Buffer.concat([buf, Buffer.from(cur.requestTxId, 'utf8')]);
        return buf;
    }, Buffer.from('', 'utf8'));

const getPostStatBytes = (asset) => Buffer.from(asset.parentId, 'utf8');

const getSidechainBytes = (asset) => {
    const {
        id, name, url, description, types
    } = asset;

    let buf = Buffer.from(id, 'utf8');
    buf = Buffer.concat([buf, Buffer.from(name, 'utf8')]);

    if (url) {
        buf = Buffer.concat([buf, Buffer.from(url, 'utf8')]);
    }

    if (description) {
        buf = Buffer.concat([buf, Buffer.from(description, 'utf8')]);
    }
    const txTypes = ['110', '150', '151', '152', '153', '154', '155'];
    txTypes.forEach((t) => {
        if (types[t]) {
            buf = Buffer.concat([buf, Buffer.from(types[t].fee.toString(), 'utf8')]);
            buf = Buffer.concat([buf, Buffer.from(types[t].amount.toString(), 'utf8')]);
        }
    });

    return buf;
};

const getParametersBytes = (asset) => Buffer.from(JSON.stringify(asset), 'utf8');

const getBytes = (transaction, skipSignature, skipSecondSignature, forSidechain) => {
    let assetSize = 0;
    let assetBytes = null;
    const type = getTransactionType(transaction.type, forSidechain);
    switch (type) {
        case TransactionTypes.POST: // post
            if (!forSidechain) { break; }
            if (transaction.asset !== null) {
                assetBytes = getPostBytes(transaction.asset.post);
                assetSize = assetBytes.length;
            }
            break;
        case TransactionTypes.POSTCOMMENT: // comment
            if (!forSidechain) { break; }
            if (transaction.asset !== null) {
                assetBytes = getCommentBytes(transaction.asset.comment);
                assetSize = assetBytes.length;
            }
            break;
        case TransactionTypes.POSTLIKE:
        case TransactionTypes.POSTDISLIKE:
        case TransactionTypes.POSTTIP:
            if (!forSidechain) { break; }
            if (transaction.asset !== null) {
                assetBytes = getPostStatBytes(transaction.asset.postStat);
                assetSize = assetBytes.length;
            }
            break;

        case TransactionTypes.POSTORDER:
            if (!forSidechain) { break; }
            if (transaction.asset !== null) {
                assetBytes = getPostOrderBytes(transaction.asset);
                assetSize = assetBytes.length;
            }
            break;

        case TransactionTypes.BATCHSEND:
            assetBytes = getBatchSendBytes(transaction.asset.batch);
            assetSize = assetBytes.length;
            break;

        case TransactionTypes.SIGNATURE: // Signature
            assetSize = 32;
            assetBytes = getSignatureBytes(transaction.asset.signature);
            break;

        case TransactionTypes.DELEGATE: // Delegate
        case TransactionTypes.SIDECHAIN_DELEGATE:
            assetBytes = getDelegateBytes(transaction.asset.delegate);
            assetSize = assetBytes.length;
            break;

        case TransactionTypes.VOTE: // Vote
            if (transaction.asset.votes !== null) {
                assetBytes = Buffer.from(transaction.asset.votes.join(""), "utf8");
                assetSize = assetBytes.length;
            }
            break;

        case TransactionTypes.MULTI: // Multi-Signature
            {
                const keysgroupBuffer = Buffer.from(transaction.asset.multisignature.keysgroup.join(""), "utf8");

                const bb = new ByteBuffer(1 + 1 + keysgroupBuffer.length, true);

                bb.writeByte(transaction.asset.multisignature.min);
                bb.writeByte(transaction.asset.multisignature.lifetime);
                for (let i = 0; i < keysgroupBuffer.length; i += 1) {
                    bb.writeByte(keysgroupBuffer[i]);
                }
                bb.flip();
                assetBytes = bb.toBuffer();
                assetSize = assetBytes.length;
                break;
            }
        case TransactionTypes.SIDECHAIN:
            if (transaction.asset !== null) {
                assetBytes = getSidechainBytes(transaction.asset.sidechain);
                assetSize = assetBytes.length;
            }
            break;
        case TransactionTypes.FOLLOWING:
        case TransactionTypes.SEND:
            assetBytes = null;
            assetSize = 0;
            break;
        case TransactionTypes.GIVEAWAY: // giveAway
            if (transaction.asset !== null) {
                assetBytes = getGiveAwayBytes(transaction.asset.giveAway);
                assetSize = assetBytes.length;
            }
            break;

        case TransactionTypes.GIVEAWAYREQUEST: // giveAwayRequest
            if (transaction.asset !== null) {
                assetBytes = getGiveAwayRequestBytes(transaction.asset.giveAwayRequest);
                assetSize = assetBytes.length;
            }
            break;
        case TransactionTypes.GIVEAWAYAPPROVEDREQUEST: // approved giveAwayRequest
            if (transaction.asset !== null) {
                assetBytes = getApprovedGiveAwayRequestBytes(
                    transaction.asset.approved,
                );
                assetSize = assetBytes.length;
            }
            break;
        case TransactionTypes.PARAMETER:
            if (transaction.asset !== null) {
                assetBytes = getParametersBytes(transaction.asset.params);
                assetSize = assetBytes.length;
            }
            break;
        default:
            // don't sign sidechain transaction's asset
            // act as mainchain's sidechainTx type
            break;
    }

    const bb = new ByteBuffer(32 + 4 + 4 + 32 + 32 + 8 + 8 + 8 + (transaction.sidechainId ? 8 : 0) + 64 + 64 + assetSize, true);
    const id = Buffer.from(transaction.id.replace(/-/g, ''), 'hex');
    for (let i = 0; i < id.length; i += 1) {
        bb.writeByte(id[i]);
    }
    bb.writeInt(transaction.type);
    bb.writeInt(transaction.timestamp);

    const senderPublicKeyBuffer = Buffer.from(transaction.senderPublicKey, 'hex');
    for (let i = 0; i < senderPublicKeyBuffer.length; i += 1) {
        bb.writeByte(senderPublicKeyBuffer[i]);
    }

    if (transaction.requesterPublicKey) {
        const requesterPublicKey = Buffer.from(transaction.requesterPublicKey, 'hex');
        for (let i = 0; i < requesterPublicKey.length; i += 1) {
            bb.writeByte(requesterPublicKey[i]);
        }
    }

    if (transaction.recipientId) {
        let recipient = transaction.recipientId.slice(1);
        recipient = new Bignum(recipient).toBuffer({
            size: 8
        });

        for (let i = 0; i < 8; i += 1) {
            bb.writeByte(recipient[i] || 0);
        }
    } else {
        for (let i = 0; i < 8; i += 1) {
            bb.writeByte(0);
        }
    }

    bb.writeLong(transaction.amount);

    bb.writeLong(transaction.fee);

    if (transaction.sidechainFee !== null && transaction.sidechainFee >= 0) {
        bb.writeLong(transaction.sidechainFee);
    }

    if (transaction.sidechainId) {
        const sidechainId = Buffer.from(transaction.sidechainId, 'utf8');
        for (let i = 0; i < 8; i += 1) {
            bb.writeByte(sidechainId[i] || 0);
        }
    }

    if (assetSize > 0) {
        for (let i = 0; i < assetSize; i += 1) {
            bb.writeByte(assetBytes[i]);
        }
    }

    if (!skipSignature && transaction.signature) {
        const signatureBuffer = Buffer.from(transaction.signature, 'hex');
        for (let i = 0; i < signatureBuffer.length; i += 1) {
            bb.writeByte(signatureBuffer[i]);
        }
    }

    if (!skipSecondSignature && transaction.signSignature) {
        const signSignatureBuffer = Buffer.from(transaction.signSignature, 'hex');
        for (let i = 0; i < signSignatureBuffer.length; i += 1) {
            bb.writeByte(signSignatureBuffer[i]);
        }
    }

    bb.flip();
    return bb.toBuffer();
};

const getHash = (transaction, skipSignature, skipSecondSignature, forSidechain) => {
    const bytes = getBytes(transaction, skipSignature, skipSecondSignature, forSidechain);
    return crypto.createHash("sha256").update(ArrayBufferToHexString(bytes), 'hex').digest();
};

/**
 * Get transaction id
 * 
 * @param {Object} transaction 
 * @returns {string}
 */
const getId = () => v4();

/**
 * Sign transaction
 * 
 * @param {any} transaction 
 * @param {any} keys
  * @returns 
 */
const sign = (transaction, keys, forSidechain) => {
    const hash = getHash(transaction, true, true, forSidechain);
    const signature = nacl.sign.detached(hash, Buffer.from(keys.privateKey, "hex"));

    return Buffer.from(signature).toString('hex');
};

/**
 * Use second secret to sign the transaction
 * 
 * @param {any} transaction 
 * @param {any} keys 
 */
const secondSign = (transaction, keys, forSidechain) => {
    const hash = getHash(transaction, false, true, forSidechain);
    const signature = nacl.sign.detached(hash, Buffer.from(keys.privateKey, "hex"));

    return Buffer.from(signature).toString('hex');
};

/**
* Multi sign transaction
* 
* @param {any} transaction 
* @param {any} keys 
* @returns 
*/
const multiSign = (transaction, keys) => {
    const bytes = getBytes(transaction, true, true);
    const hash = crypto.createHash('sha256').update(bytes).digest();
    const signature = nacl.sign.detached(hash, Buffer.from(keys.privateKey, "hex"));

    return Buffer.from(signature).toString('hex');
};
/**
 * Verify transaction's signature
 * 
 * @param {any} transaction 
 * @returns True if signature is verified success; otherwise, false
 */
const verifySignature = (transaction) => {
    const bytes = getBytes(transaction);
    const data2 = Buffer.alloc(bytes.length);

    for (let i = 0; i < data2.length; i += 1) {
        data2[i] = bytes[i];
    }
    const hash = crypto.createHash("sha256").update(data2, "hex").digest();

    const signatureBuffer = Buffer.from(transaction.signature, "hex");

    const senderPublicKeyBuffer = Buffer.from(transaction.senderPublicKey, "hex");

    const res = nacl.sign.detached.verify(hash, signatureBuffer, senderPublicKeyBuffer);

    return res;
};

/**
 * Generate key pair (public and private key) by secret
 * 
 * @param {any} secret 
 * @returns {object} key pair object
 */
const getKeys = (secret) => {
    const hash = crypto.createHash("sha256").update(secret, "utf8").digest();
    const keypair = nacl.sign.keyPair.fromSeed(hash);
    return {
        publicKey: Buffer.from(keypair.publicKey).toString('hex'),
        privateKey: Buffer.from(keypair.secretKey).toString('hex'),
    };
};
/**
 * Generate address by public key
 * 
 * @param {string} publicKey 
 * @returns {string} address
 */
const getAddress = (publicKey) => {
    const publicKeyHash = crypto.createHash("sha256").update(publicKey, "hex").digest();
    const temp = Buffer.alloc(8);

    for (let i = 0; i < 8; i += 1) {
        temp[i] = publicKeyHash[7 - i];
    }
    return `D${Bignum.fromBuffer(temp).toString()}`;
};

const createSecret = () => {
    const code = new Mnemonic(Mnemonic.Words.ENGLISH);
    return `${code.toString()} ${Math.floor(Math.random() * 1000)}`;
};

const generateAddress = (secret) => {
    const keypair = getKeys(secret);
    const address = getAddress(keypair.publicKey);

    return { keypair, address };
};

export default {
    getId,

    getBytes,

    sign,

    secondSign,

    multiSign,

    getKeys,

    getAddress,

    verifySignature,

    createSecret,

    generateAddress
};

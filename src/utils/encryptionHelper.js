import crypto from 'crypto-browserify';
import RSA from 'keypair';

const CIPHERS = {
    AES_128: "aes128", // requires 16 byte key
    AES_128_CBC: "aes-128-cbc", // requires 16 byte key
    AES_192: "aes192", // requires 24 byte key
    AES_256: "aes256", // requires 32 byte key
};

const getHash = (text, encoding) => {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest(encoding);
};

const getKeyAndIV = (key) => {
    const ivBuffer = crypto.randomBytes(16);
    const keyBuffer = (key instanceof Buffer) ? key : getHash(key);

    return {
        iv: ivBuffer,
        key: keyBuffer,
    };
};
/**
 * Generates a new asymmetric key pair of the given type.
 *
 * @returns privateKey, publicKey
 */
const generateKeyPair = () => RSA();
/**
 * Encrypt post content by post key
 *
 * @param {*} key
 * @param {*} iv 
 * @param {*} text Post Content
 * @param {*} encoding
 * @returns
 */
const encryptTextAES = (secret, text) => {
    let key; let iv;
    if (typeof secret === 'object') {
        key = secret.key;
        iv = secret.iv;
    } else if (typeof secret === 'string') {
        const keyIV = getKeyAndIV(secret);
        key = keyIV.key;
        iv = keyIV.iv;
    } else {
        throw new Error('Invalid format');
    }

    const cipher = crypto.createCipheriv(CIPHERS.AES_256, key, iv);

    let result = cipher.update(text, "utf8", "base64");
    result += cipher.final('base64');
    return result;
};
/**
 * Encrypt post content by post key
 *
 * @param {*} key
 * @param {*} iv 
 * @param {*} text Post Content
 * @param {*} encoding
 * @returns
 */
const decryptTextAES = (secret, encryptedText) => {
    let key; let iv;
    if (typeof secret === 'object') {
        key = secret.key;
        iv = secret.iv;
    } else if (typeof secret === 'string') {
        const keyIV = secret.split(':');
        [key, iv] = keyIV;
    } else {
        throw new Error('Invalid format');
    }

    const decipher = crypto.createDecipheriv(CIPHERS.AES_256, key, iv);

    let result = decipher.update(encryptedText, "base64", "utf8");
    result += decipher.final('utf8');
    return result;
};

/**
 * AES Encryption post Key
 *
 * @param {*} privateKey privateKey to encrypt post key
 * @param {*} text  post key
 * @returns
 */
const encryptTextRSA = (privateKey, text) => {
    const buffer = (text instanceof Buffer) ? text : Buffer.from(text);
    const encrypted = crypto.privateEncrypt({
        key: privateKey,
        padding: 1,
    }, buffer);
    return encrypted.toString("base64");
};

/**
 * Decrypt post Key
 *
 * @param {*} publicKey publicKey to decrypt post key
 * @param {*} encrypted  encrypted post key
 * @returns
 */
const decryptTextRSA = (publicKey, encrypted) => {
    const buffer = Buffer.from(encrypted, "base64");
    const decrypted = crypto.publicDecrypt(
        {
            key: publicKey,
            padding: 1,
        },
        buffer
    );
    return decrypted.toString("utf8");
};

export default {
    CIPHERS,
    getKeyAndIV,
    encryptTextAES,
    decryptTextAES,
    encryptTextRSA,
    decryptTextRSA,
    generateKeyPair,
    getHash,
};
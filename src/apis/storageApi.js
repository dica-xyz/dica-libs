import httpUtil from './util';

const StorageApi = (options) => {
    const getApiPath = () => `/api/storages`;

    const getStorageBytes = (post) => {
        try {
            const _post = JSON.stringify(post);
            return Buffer.from(_post, 'utf8');
        } catch (e) {
            throw Error(e.toString());
        }
    };

    /**
     *Get hash of file only
     *
     * @param {*} params
     * @returns
     */
    const getFileHash = async (params) => {
        const res = await httpUtil(options).post(`${getApiPath()}/getFileHash`, params);

        if (!res?.data?.success) {
            throw new Error('Failed to create file hash');
        }

        return res.data.data;
    };

    return {
        getFileHash,
        getStorageBytes
    };
};
export default StorageApi;
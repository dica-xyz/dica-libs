import httpUtil from './util';

const SiteApi = (options) => {
    const getApiPath = () => `/api/site`;

    const getLatestSchemaId = () => httpUtil(options).get(`${getApiPath()}/schemaId`);

    const getSchema = async () => {
        const res = await httpUtil(options).get(`${getApiPath()}`);
        if (res?.data.success) {
            return res.data.data;
        }
        return null;
    };

    /** Get sidechain's sponsorship info for specified user */
    const getSponsorshipInfoByAddress = (params) => httpUtil(options).post(`${getApiPath()}/getSponsorshipInfoByAddress`, params);

    return {
        getLatestSchemaId,
        getSchema,
        getSponsorshipInfoByAddress
    };
};
export default SiteApi; 
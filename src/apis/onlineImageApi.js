import httpUtil from './util';

const OnlineImage = (options) => {
    const search = (keyword, page, source) => httpUtil(options).get(`/api/onlineimage/search?source=${source}&search=${keyword}&page=${page}`);

    return { search };
};
export default OnlineImage;
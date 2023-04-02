import axios from 'axios';
import { isServer } from '../utils/environment';
import {
    isPublication,
    getPublicationFromUrl
} from '../utils/url';

axios.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error?.response?.status === 429) {
            return Promise.reject(new Error('Too many requests, please try again later.'));
        }

        return Promise.reject(error?.response?.data?.err || error);
    }
);

const HttpUtil = (options) => {

    let _axios = axios;

    if (options) {
        _axios = axios.create(options);
    }

    const defaultHeaders = {
        'content-type': 'application/json; charset=utf-8',
        Accept: 'application/json'
    };

    const publicationHeader = () => {
        // executed on client side
        // extract publication's address from url
        // if any, set publication or publication name to http header
        const publication = isServer ? {} : getPublicationFromUrl();
        return publication ? publication : window.PUBLICATION ? { publication: window.PUBLICATION } : {};
    };

    const getHeaders = (headers) => {
        const _headers = {
            ...defaultHeaders,
            ...publicationHeader(),
            draft: isServer ? false : (window.DRAFT || false),
            ...headers
        };
        return _headers;
    };

    const host = (process.env.NODE_ENV === 'test')
        ? 'http://localhost:3001'
        : !isServer ? window.CMS_SERVER || '' : 'http://localhost:3001'; // empty for now. Need to return server for SSR

    const put = (url, data, options) => _axios.put(
        url.startsWith('http') ? url : `${host}${url}`,
        data,
        {
            ...options,
            headers: getHeaders(options?.headers)
        }
    );
    const post = (url, data, options) => _axios.post(
        url.startsWith('http') ? url : `${host}${url}`,
        data,
        {
            ...options,
            headers: getHeaders(options?.headers)
        }
    );
    const get = (url, options) => _axios.get(
        url.startsWith('http') ? url : `${host}${url}`,
        {
            ...options,
            headers: getHeaders(options?.headers)
        }
    )

    return {
        put, post, get
    };
};

export default HttpUtil;
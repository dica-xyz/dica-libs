const urlEncode = (url) => {
    if (!url) return '';
    return encodeURI(url.replace(/\s+/g, '_'));
};

const urlDecode = (url) => {
    if (!url) return url;
    return decodeURI(url);
};

const addPathPrefix = (to, pathname) => {
    if (!pathname) { return to; }

    let path = '';

    if (pathname.indexOf(`/_draft`) > -1) {
        path = `/_draft`;
    }

    const publication = pathname.split(/\//g).find((p) => p.match(/^@D*/));
    if (publication) {
        path += `/${publication}`;
    }

    path = `${path}${to}`;
    return path;
};

const isPublication = (path) => {
    const reg = /^\/@/;

    return reg.test(path);
};

const getPublication = (pathName) => {
    const path = pathName.replace('/_draft', '');
    const reg = /^\/@D[0-9]+/ig;
    const publication = path.match(reg);
    if (publication?.length > 0) {
        return publication[0].replace('/@', '');
    }
    return null;
};

const getPublicationName = (pathName) => {
    const _pathName = decodeURI(pathName);
    const path = _pathName.replace('/_draft', '');
    const reg = /^\/@[\w\s!@$&_.-]+/ig;
    const publication = path.match(reg);
    if (publication?.length > 0) {
        return publication[0].replace('/@', '');
    }
    return null;
};

/** Return publication or publication name */
const getPublicationFromUrl = () => {
    const pathName = window.location.pathname;
    const publication = getPublication(pathName);
    if (publication) {
        return { publication };
    }

    const publicationName = getPublicationName(pathName);
    if (publicationName) {
        return { publicationName };
    }
    return null;
};
export {
    isPublication,
    getPublication,
    getPublicationName,
    getPublicationFromUrl,
    urlEncode,
    urlDecode,
    addPathPrefix
};

export default {
    isPublication,
    getPublication,
    getPublicationName,
    getPublicationFromUrl,
    urlEncode,
    urlDecode,
    addPathPrefix
};
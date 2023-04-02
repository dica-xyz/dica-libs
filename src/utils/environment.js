const isServer = !(
    typeof window !== 'undefined'
    && window.document
    && window.document.documentElement
);

export { isServer };

export default { isServer };
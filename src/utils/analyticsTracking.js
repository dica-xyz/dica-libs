// eslint-disable-next-line camelcase
const GA_MEASUREMENT_IDs = ['G-T126VCNBZ3'];

const getPublicationGoogleAnalytisId = () => {
    let schema = global ? global.localStorage.getItem('schema') : null;
    if (schema) {
        schema = JSON.parse(schema);
        return schema.settings.googleAnalyticsId;
    }
    return null;
};
const gtag = (...arg) => { global.dataLayer.push(arg); };

const googleAnalyticsTracking = (location) => {
    GA_MEASUREMENT_IDs.forEach((id) => {
        gtag('config', id, { page_path: location.href });// Update the user's current page
        gtag('set', { page_view: location.pathname });
    });
};

const countlyAnalyticsTracking = () => {
    // Start pushing function calls to queue
    // Track sessions automatically (recommended)
    global.Countly.q.push(['track_sessions']);

    // track web page views automatically (recommended)
    global.Countly.q.push(['track_pageview']);
};

const AanalyticsTracking = (history) => {
    if (process.env.NODE_ENV !== 'production') return;

    const gaId = getPublicationGoogleAnalytisId();

    if (gaId) {
        GA_MEASUREMENT_IDs.push(gaId);
        gtag('config', gaId);
    }

    history.listen((location) => {
        googleAnalyticsTracking(location);
        countlyAnalyticsTracking();
    });
};

export default AanalyticsTracking;
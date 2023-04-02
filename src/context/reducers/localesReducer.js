import { environment } from '../../utils';
import languages from '../../locales';
import { CHANGE_LANGUAGE } from '../actions/localeActions';

// addLocaleData([...en, ...zh, ...es, ...fr, ...ru]);
const localeData = {
    ...languages.en, ...languages.zh, ...languages.es, ...languages.fr, ...languages.ru,
};

const defaultLanguage = () => {
    const language = environment.isServer ? 'en'
        : ((navigator.languages && navigator.languages[0])
            || navigator.language
            || navigator.userLanguage) || 'en';

    // Split locales with a region code
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

    // Try full locale, fallback to locale without region code, fallback to en
    return localeData[languageWithoutRegionCode] || localeData.en;
};
const initState = {
    langName: 'English',
    locale: 'en',
    messages: defaultLanguage(),
};

const reducer = (state, action) => {
    switch (action.type) {
        case CHANGE_LANGUAGE:
            switch (action.language) {
                case 'en':
                    return {
                        ...state, locale: 'en', messages: localeData.en, langName: 'English',
                    };
                case 'zh':
                    return {
                        ...state, locale: 'zh', messages: localeData.zh, langName: '中文',
                    };
                case 'fr':
                    return {
                        ...state, locale: 'fr', messages: localeData.fr, langName: 'Français',
                    };
                case 'es':
                    return {
                        ...state, locale: 'es', messages: localeData.es, langName: 'Español',
                    };
                case 'ru':
                    return {
                        ...state, locale: 'ru', messages: localeData.ru, langName: 'Pусский',
                    };
                default:
                    return state;
            }

        default:
            return state;
    }
};

export default { initState, reducer };

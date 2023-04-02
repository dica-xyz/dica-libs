import Cookies from 'js-cookie';
import { isServer } from './environment';

const addExternalCss = (themeName, link, attr = {}) => {
    const id = `${themeName}_link`;

    // eslint-disable-next-line no-console
    const callback = () => console.log(`${id} - ${link} loaded`);

    if (!document.getElementById(id)) {
        const linkNode = document.createElement('link');
        linkNode.id = id;
        linkNode.href = link;
        linkNode.rel = attr.rel || 'stylesheet';
        linkNode.onreadystatechange = callback;
        linkNode.onload = callback;
        document.getElementsByTagName('head')[0].appendChild(linkNode);
    }
};
const addGlobalStyle = (themeName, css) => {
    const id = `${themeName}-style`;
    const style = document.getElementById(id);
    if (!style) {
        const styleNode = document.createElement('style');
        styleNode.id = id;
        styleNode.appendChild(document.createTextNode(css));
        document.getElementsByTagName('head')[0].appendChild(styleNode);
    } else {
        style.innerHTML = css;
    }
};

// Removes an element from the document
const removeElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) { element.parentNode.removeChild(element); }
};

const getTheme = (themes, themeName) => {
    let theme = themes.find((_theme) => _theme.themeName === themeName);
    // if selected theme is gone, then pick the first one
    if (!theme) { [theme] = themes; }
    return theme;
};

const deleteTheme = (themeName) => {
    removeElement(`${themeName}_link`);
    removeElement(`${themeName}_style`);
};

const setTheme = (themes, themeName) => {
    if (isServer) return;

    const prevTheme = window.localStorage.getItem('defaultTheme');
    if (themeName && prevTheme !== themeName) {
        deleteTheme(prevTheme);
    }
    const theme = getTheme(themes, themeName);
    const _themeName = theme.themeName;
    if (theme.externalCss) {
        theme.externalCss.split('\n').forEach((link) => {
            addExternalCss(_themeName, link);
        });
    }
    if (theme.globalCss) {
        addGlobalStyle(_themeName, theme.globalCss);
    }

    window.localStorage.setItem('defaultTheme', _themeName);

    // pass defaultTheme for ssr
    Cookies.set('defaultTheme', _themeName);
    return theme;
};

const getThemesData = (themes, { onClick, setIcon }) => themes.map((theme) => (
    {
        label: theme.themeName,
        key: theme.id,
        icon: setIcon(theme),
        onClick: () => onClick && onClick(theme)
    }
));
export {
    addGlobalStyle,
    removeElement,
    setTheme,
    deleteTheme,
    getThemesData
};

export default {
    addGlobalStyle,
    removeElement,
    getTheme,
    setTheme,
    deleteTheme,
    getThemesData
};
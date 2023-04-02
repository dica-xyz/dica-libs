import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import localesReducer from './reducers/localesReducer';
import postsReducer from './reducers/postsReducer';
import ssrReducer from './reducers/ssrReducer';
import userReducer from './reducers/userReducer';
import themeReducer from './reducers/themeReducer';
import accountsReducer from './reducers/accountsReducer';
import httpOptionsReducer from './reducers/httpOptionsReducer';

const GlobalContext = createContext();

const { Provider } = GlobalContext;

const propTypes = {
    children: PropTypes.object.isRequired
};

const GlobalProvider = (props) => {
    // eslint-disable-next-line react/prop-types
    const { children, site, httpOptions: pHttpOptions, user: pUser, ...rest } = props;
    const [locales, localesDispatch] = useReducer(localesReducer.reducer, localesReducer.initState);
    const [postStore, postsDispatch] = useReducer(postsReducer.reducer, postsReducer.initState);
    const [ssrProps, ssrDispatch] = useReducer(ssrReducer.reducer, ssrReducer.initState);
    const [user, userDispatch] = useReducer(userReducer.reducer, { ...userReducer.initState, ...pUser });
    const [accounts, accountsDispatch] = useReducer(accountsReducer.reducer, accountsReducer.initState);
    const [httpOptions, httpOptionsDispatch] = useReducer(httpOptionsReducer.reducer, { ...httpOptionsReducer.initState, ...pHttpOptions });

    const themeInitState = {
        ...themeReducer.initState,
        all: site.schema.themes
    }
    const [themes, themesDispatch] = useReducer(themeReducer.reducer, themeInitState);


    let initialContext = {
        locales,
        localesDispatch,
        postStore,
        postsDispatch,
        ssrProps,
        ssrDispatch,
        user,
        userDispatch,
        accounts,
        accountsDispatch,
        themes,
        themesDispatch,
        site,
        httpOptions,
        httpOptionsDispatch,
        ...rest
    };

    return (
        <Provider value={initialContext}>
            {children}
        </Provider>
    );
};
GlobalProvider.prototype = propTypes;
export { GlobalContext, GlobalProvider };

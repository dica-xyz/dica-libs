import React, { useContext } from 'react';
import * as userActions from '../actions/userActions';
import * as accountsActions from '../actions/accountsActions';
import * as postActions from '../actions/postActions';
import * as localeActions from '../actions/localeActions';
import * as themesActions from '../actions/themesActions';
import bindActionCreators from '../bindActionCreators';
import { GlobalContext } from '..';

export default (Component) => (props) => {
    const globalContext = useContext(GlobalContext);
    const {
        user, site, postStore, ssrProps, locales, themes, httpOptions,
        userDispatch, postsDispatch, localeDispatch, accounts, accountsDispatch,
        themesDispatch, ...rest
    } = globalContext;

    const mapContextToProps = () => ({
        user, accounts, locales, ssrProps, postStore, site, themes, httpOptions, ...rest
    });
    const mapDispatchToProps = () => ({
        ...bindActionCreators(userActions, userDispatch),
        ...bindActionCreators(accountsActions, accountsDispatch),
        ...bindActionCreators(postActions, postsDispatch),
        ...bindActionCreators(localeActions, localeDispatch),
        ...bindActionCreators(themesActions, themesDispatch),
    });

    const contextToProps = mapContextToProps();
    const dispatchToProps = mapDispatchToProps();

    return (
        <Component {...{ ...props, ...contextToProps, ...dispatchToProps }} />
    );
};
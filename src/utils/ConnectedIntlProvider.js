import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { GlobalContext } from '../context';

const propTypes = {
    children: PropTypes.object
};
const ConnectedIntlProvider = ({ children }) => {
    const { locales } = useContext(GlobalContext);
    const { locale, messages } = locales;
    return (
        <IntlProvider locale={locale} messages={messages} key={locale}>
            {children}
        </IntlProvider>
    );
};

ConnectedIntlProvider.propTypes = propTypes;

export default ConnectedIntlProvider;

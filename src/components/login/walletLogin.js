import React from 'react';
import PropTypes from 'prop-types';
import WalletUploader from '../walletUploader';

const propTypes = {
    onWalletCreated: PropTypes.func,
};

const defaultProps = {};

const WalletLogin = (props) => {
    const { onWalletCreated } = props;
    return (<WalletUploader onWalletChange={onWalletCreated} />
    );
};

WalletLogin.propTypes = propTypes;

WalletLogin.defaultProps = defaultProps;

export default WalletLogin;

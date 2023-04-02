import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Input, Modal, Button, Tooltip
} from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import WalletUploader from '../walletUploader';
import crypto from '../../utils/blockchain/crypto';

const { getKeys, getAddress } = crypto;

const propTypes = {
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
    showAddress: PropTypes.bool
};
const defaultProps = {
    showAddress: true,
    placeholder: 'Type or use wallet to enter the secret. Wallet is NOT uploaded.'
};

const SecretInput = (props) => {
    const {
        onChange, placeholder, value, style, showAddress
    } = props;
    const [showWallet, setShowWallet] = useState(false);
    const [secret, setSecret] = useState(value);
    const [address, setAddress] = useState();
    const getAddressBySecret = (_secret) => {
        if (!_secret || !_secret.length) { return null; }
        const keys = getKeys(_secret);
        return getAddress(keys.publicKey);
    };

    useEffect(() => {
        setSecret(value);
        setAddress(getAddressBySecret(value));
    }, [value]);

    const _onChange = (_value) => {
        setAddress(getAddressBySecret(_value));
        onChange(_value);
    };
    return (
        <>
            <Tooltip
                placement="top"
                title={showAddress && address ? (
                    <i>
                        Address:
                        {' '}
                        {address}
                    </i>
                ) : null}>
                <Input.Password
                    placeholder={placeholder}
                    addonAfter={
                        (
                            <WalletOutlined
                                style={{ cursor: 'pointer' }}
                                onClick={() => { setShowWallet(true); }} />
                        )
                    }
                    style={style}
                    onChange={(e) => _onChange(e.target.value)}
                    value={secret}
                />
            </Tooltip>
            <Modal
                title="Choose a wallet file"
                destroyOnClose={true}
                open={showWallet}
                footer={[
                    <Button key="back" onClick={() => { setShowWallet(false); }}>
                        Cancel
                    </Button>
                ]}
            >
                <WalletUploader onWalletChange={(wallet) => {
                    setSecret(wallet.secret);
                    onChange(wallet.secret);
                    setShowWallet(false);
                }} />
            </Modal>
        </>
    );
};
SecretInput.propTypes = propTypes;
SecretInput.defaultProps = defaultProps;
export default SecretInput;
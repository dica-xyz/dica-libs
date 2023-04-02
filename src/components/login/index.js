import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Divider, Tabs, Modal } from 'antd';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import FileSaver from 'file-saver';
import crypto from '../../utils/blockchain/crypto';
import withApis from '../withApis';
import Button from '../button';
import WalletLogin from './walletLogin';
import LocalLogin from './localLogin';
import SecretLogin from './secretLogin';

const propTypes = {
    isLoggedin: PropTypes.func,
    userLogin: PropTypes.func,
    user: PropTypes.object,
    apis: PropTypes.object,
    visible: PropTypes.bool,
    onClose: PropTypes.func
};
const defaultProps = {
    visible: false
};

const Login = (props) => {
    const {
        userLogin, apis, visible, onClose
    } = props;
    const { accountApi, options } = apis;
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [account, setAccount] = useState();
    useEffect(() => {
        setShowLoginModal(visible);
    }, [visible]);

    const onWalletCreated = async (wallet) => {
        const _account = await accountApi(options).getAccount(wallet.address);
        if (_account) {
            userLogin({
                ...wallet,
                ..._account
            });
        } else {
            userLogin({
                ...wallet
            });
        }
        Cookies.set('userAddress', wallet.address);
    };

    const createAccount = () => {
        const secret = crypto.createSecret();
        const { address } = crypto.generateAddress(secret);
        setShowLoginModal(false);
        setShowWalletModal(true);
        setAccount({ address, secret });
    };

    const items = [
        {
            label: 'Wallet',
            key: 'wallet',
            children: <WalletLogin {...props} onWalletCreated={onWalletCreated} />
        },
        {
            label: 'Email',
            key: 'email',
            children: <LocalLogin {...props} onWalletCreated={onWalletCreated} />
        },
        {
            label: 'Secret',
            key: 'secret',
            children: <SecretLogin {...props} onWalletCreated={onWalletCreated} />
        }
    ];

    return (
        <>
            <Modal
                open={showLoginModal}
                title="Login / Create Account"
                width={600}
                footer={null}
                afterClose={onClose}
                onCancel={onClose}>
                <div className="dica-login">
                    <Tabs
                        defaultActiveKey="wallet"
                        items={items}
                    />
                    <Divider />
                    <p className="new-user">New User?</p>
                    <Button block={true} type="primary" onClick={createAccount}>Create an Account</Button>
                </div>
            </Modal>
            <Modal
                open={showWalletModal}
                title="Your wallet is being generated"
                width={400}
                onCancel={() => setShowWalletModal(false)}
                onOk={() => {
                    const blob = new Blob([JSON.stringify(account)], { type: "text/json;charset=utf-8" });
                    FileSaver.saveAs(blob, `${account.address}-${dayjs().format('YYYYMMDDHHmmss')}.dica`);
                    onWalletCreated(account);
                    setShowWalletModal(false);
                }}
            >
                <div className="dica-login-create-account">
                    Wallet contains your account information, such as address and secret, which is used to log in to blockchain.
                    Keep it safe. Lose the wallet, you lose all your assets. Click OK to save your wallet file.
                </div>
            </Modal>
        </>
    );
};

Login.propTypes = propTypes;

Login.defaultProps = defaultProps;

export default withApis(Login);

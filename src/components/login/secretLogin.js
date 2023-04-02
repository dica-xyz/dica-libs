import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';
import Button from '../button';
import crypto from '../../utils/blockchain/crypto';
import { MessageBox } from '../messageBox';

const propTypes = {
    onWalletCreated: PropTypes.func,
};

const defaultProps = {};

const SecretLogin = (props) => {
    const { onWalletCreated } = props;
    const [secret, setSecret] = useState();
    const registerWallet = async () => {
        const { keypair: { publicKey }, address } = crypto.generateAddress(secret);
        const wallet = { address, secret, publicKey };
        if (wallet) { onWalletCreated(wallet); }
    };

    const userLogin = async () => {
        if (secret.trim() === '') {
            MessageBox({ type: 'error', title: 'Secret empty', body: 'Create a secret, please' });
            return;
        }
        await registerWallet();
    };

    return (
        <Form>
            <Form.Item label="Secret">
                <Input.Password name="secret" onChange={(e) => setSecret(e.target.value)} value={secret} />
                <small>
                    Your secret is used at local computer only and never gets sent out over wire.
                </small>
                <Button block={true} onClick={userLogin}>Log In</Button>
            </Form.Item>
        </Form>
    );
};

SecretLogin.propTypes = propTypes;
SecretLogin.defaultProps = defaultProps;

export default SecretLogin;

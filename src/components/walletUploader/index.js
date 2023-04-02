/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InboxOutlined } from '@ant-design/icons';
// import styles from './style.css';
import { Upload, Modal, Input } from 'antd';
import EncryptionHelper from '../../utils/encryptionHelper';
import crypto from '../../utils/blockchain/crypto';
import { MessageBox } from '../messageBox';

const { Dragger } = Upload;
const propTypes = {
    onWalletChange: PropTypes.func,
};

const defaultProps = {};

class WalletUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            wallet: null,
        };
    }

    beforeUpload = async (file) => {
        const reader = new FileReader();
        reader.addEventListener('load', async () => {
            const wallet = JSON.parse(reader.result);
            if (wallet.encrypted) {
                this.setState({ showPassword: true, wallet });
            } else {
                this.props.onWalletChange(wallet);
            }
        });
        reader.readAsText(file);
        return false;
    };

    decryptWallet = async () => {
        try {
            const { wallet, password } = this.state;
            const {
                address, secret, postKeypairs, encrypted,
            } = wallet;
            const decryptedWallet = { address };

            const keyIV = EncryptionHelper.getKeyAndIV(password);
            keyIV.iv = Buffer.from(encrypted, 'hex');

            decryptedWallet.secret = EncryptionHelper.decryptTextAES(keyIV, secret);
            if (decryptedWallet.secret.startsWith(address)) {
                decryptedWallet.secret = decryptedWallet.secret.substr(decryptedWallet.secret.indexOf(':') + 1);
                decryptedWallet.keypair = crypto.getKeys(decryptedWallet.secret);
                decryptedWallet.postKeypairs = postKeypairs?.map((key) => ({
                    privateKey: EncryptionHelper.decryptTextAES(keyIV, key.privateKey),
                    publicKey: EncryptionHelper.decryptTextAES(keyIV, key.publicKey),
                }));
                this.props.onWalletChange(decryptedWallet);
            } else {
                MessageBox({ title: 'Password incorrect', type: 'error' });
            }
        } catch (err) {
            MessageBox({ title: 'Password incorrect', type: 'error' });
        } finally {
            this.setState({ showPassword: false });
        }
    };

    handleCancel = () => {
        this.setState({
            showPassword: false,
        });
    };

    render() {
        const { password } = this.state;
        const props = {
            accept: '.dica',
            multiple: false,
            beforeUpload: this.beforeUpload,
            showUploadList: false,
        };
        return (
            <>
                <Dragger {...props}>
                    <p className="dica-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="dica-upload-text">To login, click or drag wallet file to this area.</p>
                    <p className="dica-upload-hint">Your secret is kept at local and never gets sent out over network.</p>
                </Dragger>
                <Modal
                    title="Please enter wallet's password"
                    destroyOnClose={true}
                    open={this.state.showPassword}
                    onOk={this.decryptWallet}
                    onCancel={this.handleCancel}>
                    <Input.Password
                        name="password" value={password}
                        placeholder="wallet's password"
                        onChange={(e) => this.setState({ password: e.target.value })} />
                </Modal>
            </>
        );
    }
}

WalletUploader.propTypes = propTypes;

WalletUploader.defaultProps = defaultProps;

export default WalletUploader;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import Button from '../button';
import { NeedLogin } from '../messageBox';
import {
    Form, Modal, Input, Alert
} from 'antd';
import utils from '../../utils';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';

const { EncryptionHelper } = utils;
const propTypes = {
    user: PropTypes.object,
    address: PropTypes.string,
    form: PropTypes.object,
};

const defaultProps = {};

const EncryptWalletButton = (props) => {
    const { user } = props;
    const { address, secret, postKeypairs } = user;
    const [form] = Form.useForm();
    const params = useParams();

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };
    const [show, setShow] = useState(false);

    const toggle = (_show = true) => {
        if (!user.isLogin) {
            NeedLogin();
            return;
        }
        setShow(_show && !show);
    };

    const encryptWallet = (password) => {
        const wallet = { address };
        const keyIV = EncryptionHelper.getKeyAndIV(password);
        wallet.secret = EncryptionHelper.encryptTextAES(keyIV, `${address}:${secret}`);
        wallet.postKeypairs = postKeypairs && postKeypairs.map((key) => ({
            keyName: key.keyName,
            privateKey: EncryptionHelper.encryptTextAES(keyIV, key.privateKey),
            publicKey: EncryptionHelper.encryptTextAES(keyIV, key.publicKey),
        }));
        wallet.encrypted = keyIV.iv.toString('hex');
        const blob = new Blob([JSON.stringify(wallet)], { type: "text/json;charset=utf-8" });
        FileSaver.saveAs(blob, `${wallet.address}-encrypted${wallet.postKeypairs ? '-keypairs' : ''}-${dayjs().format('YYYYMMDDHHmmss')}.dica`);
        toggle(false);
    };

    const handleEncrypt = async () => {
        const values = await form.validateFields();
        encryptWallet(values.password);
    };

    return (
        <>
            <Button
                type="default"
                icon={<SafetyCertificateOutlined />}
                onClick={toggle}
                disabled={params.address !== address || address === ''}>
                Encrypt Wallet
            </Button>
            <Modal
                open={show}
                title="Encrypt Wallet"
                destroyOnClose={true}
                onCancel={() => toggle(false)}
                footer={[
                    <Button key="cancel" type="default" onClick={() => toggle(false)}>Cancel</Button>,
                    <Button
                        key="submit"
                        type="primary"
                        disabled={address === ''}
                        onClick={handleEncrypt}>
                        Encrypt
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    {...formItemLayout}>
                    <Form.Item
                        name="password"
                        label="Password"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            })
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
                <Alert
                    showIcon
                    description="If you forget the password, there is no way to use encrypted wallet any more and you will lose all assets for good."
                    type="warning" />
            </Modal>
        </>
    );
};

EncryptWalletButton.propTypes = propTypes;

EncryptWalletButton.defaultProps = defaultProps;

export default EncryptWalletButton;

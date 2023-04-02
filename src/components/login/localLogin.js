import React from 'react';
import PropTypes from 'prop-types';
import './styles.less';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
    Button, Input, Row, Col, Form
} from 'antd';
import withApis from '../withApis';
import { MessageBox } from '../messageBox';

const propTypes = {
    onWalletCreated: PropTypes.func,
    apis: PropTypes.object
};

const defaultProps = {};

const LocalLogin = (props) => {
    const { onWalletCreated, apis } = props;
    const [form] = Form.useForm();
    const { accountApi, options } = apis;

    const handleSubmit = async () => {
        const values = await form.validateFields();
        const result = await accountApi(options).localLogin(values);
        if (result?.success) {
            onWalletCreated(result.data);
            return;
        }
        MessageBox({
            title: 'Log in failed',
            body: 'Invalid email or password',
            type: 'error'
        })
    };

    return (
        <Row id="local-login">
            <Col md={24}>
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    className="login-form">
                    <Form.Item
                        name="email"
                        rules={[
                            { type: 'email', required: true, message: 'Please enter email address!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Email"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter Password!' }]}
                    >

                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <small>Forgot password? Use wallet to login, then go to Profile/Registration and register again in profile.</small>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

LocalLogin.propTypes = propTypes;

LocalLogin.defaultProps = defaultProps;

export default withApis(LocalLogin);

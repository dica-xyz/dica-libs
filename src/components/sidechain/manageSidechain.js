/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { SyncOutlined } from '@ant-design/icons';
import {
    Form, Input, Row, Col, Modal,
    Space, Button
} from 'antd';
import withApis from '../withApis';
import CoinInput from '../coinInput';
import { MessageBox } from '../messageBox';
import BlockchainButton from '../blockchainButton';
import withComponentWrapper from '../withComponentWrapper';
import { shortId, blockchain } from '../../utils';
import defaultTypes from './defaultTypes';
import './styles.less';

const { TransactionTypes, getTransactionNameByValue } = blockchain;

const propTypes = {
    apis: PropTypes.object,
    user: PropTypes.object,
    sidechain: PropTypes.object,
    hideModal: PropTypes.func,
    visible: PropTypes.bool
};
const defaultProps = {};
const FormItem = Form.Item;
const { TextArea } = Input;

const ManageSidechain = (props) => {
    const {
        user, sidechain, apis,
        visible, hideModal
    } = props;
    const { sidechainApi, execApi } = apis;
    const [form] = Form.useForm();

    const convertTypesToArray = (types) => Object.entries(types).map(([key, value]) => ({
        type: key,
        name: getTransactionNameByValue(key),
        amount: value.amount / 10 ** 8,
        fee: value.fee / 10 ** 8,
        readOnly: value.readOnly
    }));

    const convertTypesFromArray = (types) => {
        const _types = {};
        types.forEach((t) => {
            const {
                type, fee, amount
            } = t;

            _types[type] = { amount: amount * 10 ** 8, fee: fee * 10 ** 8 };
        });

        return _types;
    };

    const resetForm = () => {
        form.resetFields();
        form.setFieldsValue({ id: shortId({ length: 8 }), types: convertTypesToArray(defaultTypes) });
    };

    useEffect(() => {
        if (sidechain) {
            form.setFieldsValue(sidechain);
        } else {
            resetForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sidechain]);

    const onValidation = async (cb) => {
        if (!user.isLogin) {
            cb(true);
        }
        try {
            await form.validateFields();
            cb();
        } catch (error) {
            cb('Complete the form, please');
        }
    };

    const addSidechain = async ({ secondSecret }) => {
        const {
            id, name, url, description, recipientId, types
        } = await form.validateFields();
        const _types = convertTypesFromArray(types);
        if (!_types) { return; }
        const _sidechain = {
            id,
            name,
            url: (!url || url.length === 0) ? null : url && url.replace(/^https?:\/\//, ''),
            description,
            recipientId,
            types: _types
        };
        const trs = {
            sidechain: _sidechain,
            secret: user.secret,
            secondSecret
        };
        execApi(
            (options) => sidechainApi(options).addSidechain(trs),
            () => {
                hideModal();
                MessageBox({
                    title: sidechain ? 'Sidechain modified succeeded' : 'You have created a sidechain in DICA community now',
                    type: 'success'
                });
            }
        );
    };

    const formItemLayout = {
        labelCol: {
            md: { span: 4 }
        },
        wrapperCol: {
            md: { span: 20 }
        }
    };

    return (
        <Modal
            style={{ minWidth: "1000px" }}
            title={!sidechain ? "Create new sidechain" : "Edit sidechain"}
            open={visible}
            footer={
                (
                    <Space style={{ textAlign: "right" }}>
                        <Button
                            type="default"
                            onClick={hideModal}>
                            Cancel
                        </Button>
                        <BlockchainButton
                            type="primary"
                            title="Your data will never be deleted"
                            transactionType={TransactionTypes.SIDECHAIN}
                            confirmationMessage="The sidechain you are created will be broadcasted to blockchain.
                        If you want to make changes to your sidechain, submit it agin.
                         Click OK ONLY if you consent; Otherwise, click cancel."
                            onValidation={onValidation}
                            onSubmit={addSidechain}>
                            Submit
                        </BlockchainButton>
                    </Space>
                )
            }>
            <Form
                form={form}
                className="manageSidechain"
                {...formItemLayout}
            >
                <FormItem
                    name="id"
                    label="Id"
                    rules={[
                        { max: 8, message: 'Id is 8 chars max.' },
                        { pattern: /^[\w!@$&_.-]+$/g },
                        { type: 'string', required: true, message: 'Please generate an Id for your new sidechain' }
                    ]}
                >
                    <Input
                        readOnly={true}
                        style={{ maxWidth: "200px" }}
                        addonAfter={(
                            <a title="Generate a new sidechain id">
                                <SyncOutlined onClick={() => resetForm()} />
                            </a>
                        )} />
                </FormItem>
                <FormItem
                    name="name"
                    label="Name"
                    rules={[
                        { max: 100, message: 'Sidechain name is 100 chars max.' },
                        { pattern: /^[\w\s!@$&_.-]+$/g, message: 'Sidechain name contains invalid char.' },
                        { type: 'string', required: true, message: 'Please enter a sidechain name' }
                    ]}
                >
                    <Input />
                </FormItem>
                <Form.Item
                    name="url"
                    label="URL"
                    extra="The url(ip:port) is the server address where this sidechain will be launched and will be used for subscriber to sync sidechain data."
                    rules={[
                        { max: 100, message: '100 chars max.' }
                    ]}
                >
                    <Input
                        addonBefore="http://"
                        placeholder="Enter your sidechain's url" />
                </Form.Item>
                <FormItem
                    name="description"
                    label="Description"
                    rules={[
                        { type: 'string' },
                        { max: 1000, message: 'Description is 1000 chars max.' }
                    ]}
                >
                    <TextArea
                        autoSize={{ minRows: 6, maxRows: 10 }}
                        type="text"
                    />
                </FormItem>
                <FormItem
                    name="recipientId"
                    label="Recipient"
                    rules={[
                        { type: 'string' },
                        { max: 22, message: 'Recipient is 22 chars max.' }
                    ]}
                    extra="Sidechain&apos; transaction fee below will be paid to sidechain creator's account; however, if specified, to this account instead."
                >
                    <Input style={{ maxWidth: "200px" }} />
                </FormItem>
                <FormItem
                    label="Transaction Types"
                    extra={
                        (
                            <ul>
                                <li>Amount of coins will be paid to recipient.</li>
                                <li>Fee will be paid to sidechain owner.</li>
                            </ul>
                        )
                    }
                >
                    <Form.List name="types">
                        {(fields) => (
                            <>
                                {fields.map((field) => {
                                    const { key } = field;
                                    const types = form.getFieldValue('types');
                                    return (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Row gutter="8">
                                                <Col span="8">
                                                    <Form.Item
                                                        name={[key, 'name']}
                                                        label="Name"
                                                        key={[key, 'name']}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                    >
                                                        <Input readOnly={true} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span="4">
                                                    <Form.Item
                                                        name={[key, 'type']}
                                                        key={[key, 'type']}
                                                        label="Type"
                                                        validateTrigger={['onChange', 'onBlur']}
                                                    >
                                                        <Input readOnly={true} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span="6">
                                                    <Form.Item
                                                        name={[key, 'amount']}
                                                        key={[key, 'amount']}
                                                        label="Amount"
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        rules={[{ type: 'number' }
                                                        ]}
                                                    >
                                                        <CoinInput
                                                            style={{ width: '100px' }}
                                                            readOnly={types[key].readOnly}
                                                            min={0}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span="6">
                                                    <Form.Item
                                                        name={[key, 'fee']}
                                                        key={[key, 'fee']}
                                                        label="Fee"
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        rules={[{
                                                            type: 'number'
                                                        }
                                                        ]}
                                                    >
                                                        <CoinInput
                                                            style={{ width: '100px' }}
                                                            min={0}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Space>
                                    );
                                })}
                            </>
                        )}
                    </Form.List>
                </FormItem>
            </Form>
        </Modal>
    );
};
ManageSidechain.propTypes = propTypes;
ManageSidechain.defaultProps = defaultProps;
export default withComponentWrapper(withApis(ManageSidechain));
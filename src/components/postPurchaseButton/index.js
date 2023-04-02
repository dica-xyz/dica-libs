import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Divider, Space, } from 'antd';
import { blockchain } from '../../utils';
import withApis from '../withApis';
import { NeedLogin, MessageBox } from '../messageBox';
import Button from '../button';
import CoinNumber from '../coinNumber';
import withComponentWrapper from '../withComponentWrapper';
import './styles.less';

const { getSidechainTx } = blockchain.transaction;

const propTypes = {
    apis: PropTypes.object,
    onSuccess: PropTypes.func,
    post: PropTypes.object,
    user: PropTypes.object,
};

const defaultProps = {};

const PostPurchaseButton = (props) => {
    const {
        user, apis, post, onSuccess
    } = props;
    const {
        author, sidechainId,
        postId, options: { payment: { origin, price, commission } }
    } = post;

    const { postorderApi, execApi } = apis;
    const [visible, setVisible] = useState(true);
    const [secondSecret, setSecondSecret] = useState();
    const [sidechainFee, setSidechainFee] = useState();

    useEffect(() => {
        const getSidechainFee = async () => {
            const sidechainTx = await getSidechainTx(sidechainId, blockchain.TransactionTypes.POSTORDER);
            setSidechainFee(sidechainTx?.fee ?? 0);
        };
        getSidechainFee();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateOrder = async () => {
        const postorderTransaction = {
            amount: price,
            commission,
            publication: window.PUBLICATION,
            recipientId: author.address,
            postId,
            sidechainId,
            origin,
            secret: user.secret,
            secondSecret,
        };
        execApi(
            (options) => postorderApi(options).placePostOrder(postorderTransaction),
            (result) => {
                onSuccess(result.data);
                MessageBox({
                    title: 'Great decision. Enjoy the article.',
                    type: 'success'
                });
            }
        );
    };

    const handleOk = async () => {
        if (!user.isLogin) {
            NeedLogin();
            setVisible(false);
            return;
        }
        await generateOrder();
        setVisible(false);
    };

    return (
        <div>
            <Button type="primary" onClick={() => setVisible(true)} className="post-purchase-button">
                Unlock
            </Button>
            <Modal
                title="Unlock the post"
                open={visible}
                onOk={handleOk}
                okText="Confirm"
                onCancel={() => setVisible(false)}
            >
                <ul style={{ listStyleType: 'disc', lineHeight: '2.2', marginLeft: '10px' }}>
                    <li>
                        To read this post, you need to pay a one-time fee to author and unlock it.
                        <CoinNumber value={price + sidechainFee + 10 ** 8} title="Total Fee" />
                        <Divider plain={true} dashed={true}>Order Detail</Divider>
                        <Space direction="horizontal">
                            <CoinNumber value={price} title="Unit Price" />
                            <CoinNumber value={sidechainFee} title="Sidechain Fee" />
                            <CoinNumber value={10 ** 8} title="Mainchain Fee" />
                        </Space>
                        <br />

                    </li>
                    <li>You will NOT be charged again if you have unlocked it.</li>
                    <li>
                        Click
                        <strong> Confirm </strong>
                        if you want to proceed.
                    </li>
                </ul>
                <Divider />
                <small><strong>Second Secret</strong></small>
                <Input.Password
                    placeholder="Enter second secret if set"
                    value={secondSecret}
                    autoComplete="new-password"
                    onChange={(e) => setSecondSecret(e.target.value)}
                />

            </Modal>
        </div>
    );
};

PostPurchaseButton.propTypes = propTypes;

PostPurchaseButton.defaultProps = defaultProps;

export default withComponentWrapper(withApis(PostPurchaseButton));
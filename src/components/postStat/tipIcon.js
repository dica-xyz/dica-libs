import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Space, InputNumber, Popover } from 'antd';
import {
    DollarOutlined, DollarCircleFilled
} from '@ant-design/icons';
import { MessageBox, NeedLogin } from '../messageBox';
import BlockchainButton from '../blockchainButton';
import CoinNumber from '../coinNumber';
import { blockchain } from '../../utils';

const { constants, TransactionTypes } = blockchain;
const propTypes = {
    post: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    apis: PropTypes.object,
    data: PropTypes.object
};
const defaultProps = {
};
const TipIcon = (props) => {
    const {
        post: {
            postId, author, sidechainId, transactionId
        },
        user, apis, data
    } = props;
    const { postStatApi, execApi } = apis;
    const [showPopOver, setShowPopOver] = useState(false);
    const [amount, setAmount] = useState(0);
    const [checked, setChecked] = useState(false);
    const [tip, setTip] = useState(1);

    useEffect(() => {
        setChecked(data?.checked);
        if (data?.amount) {
            const _amount = (data.amount / constants.fixedPoint).toFixed(2);
            setAmount(_amount);
        }
    }, [data]);

    const isPostBroadcasted = () => {
        if (!transactionId) {
            MessageBox({
                title: 'Unable to send tip',
                body: 'Only posts that are published in blockchain can be tipped',
                type: "info"
            });
            return false;
        }
        return true;
    };

    const toggle = () => {
        if (!isPostBroadcasted()) return;
        setShowPopOver(!showPopOver);
    };

    const handleTipValidation = (callback) => {
        toggle();
        return callback();
    };

    const statIt = async (secondSecret) => {
        if (!user.isLogin) {
            NeedLogin();
            return;
        }
        if (!isPostBroadcasted()) return;
        if (tip <= 0) {
            MessageBox({
                title: 'Amount invalid',
                body: 'Amount has to be greater than zero',
                type: "error"
            });
        }
        const stat = {
            parentId: postId,
            author,
            amount: tip * constants.fixedPoint,
            type: TransactionTypes.POSTTIP,
            sidechainId,
            ip: user.ip,
            secret: user.secret,
            secondSecret
        };
        execApi(
            (options) => postStatApi(options).tipIt(stat),
            () => {
                setAmount(amount + tip);
                setChecked(true);
            }
        );
    };

    const popoverContent = (
        <div className="tip-popup">
            <InputNumber
                style={{ marginRight: "5px" }}
                placeholder="tip"
                name="tip"
                min={1}
                defaultValue={1}
                value={tip}
                onChange={(value) => setTip(value)}
            />
            <BlockchainButton
                sidechainId={sidechainId}
                transactionType={TransactionTypes.POSTTIP}
                confirmationMessage={`You are about to tip author ${tip} D.`}
                onValidation={handleTipValidation}
                onSubmit={({ secondSecret }) => statIt(secondSecret)}
            >
                TIP
            </BlockchainButton>
        </div>
    );

    return (
        <Space direction="horizontal" size={0}>
            {
                checked
                    ? (
                        <DollarCircleFilled
                            onClick={() => toggle()}
                            className="post-stat-icon-tip post-stat-icon-checked"
                            title={`Tip author + fee: ${constants.fees[TransactionTypes.POSTTIP] / constants.fixedPoint} D.`} />
                    )
                    : (
                        <DollarOutlined
                            onClick={() => toggle()}
                            className="post-stat-icon-tip post-stat-icon"
                            title={`Tip author + fee: ${constants.fees[TransactionTypes.POSTTIP] / constants.fixedPoint} D.`} />
                    )
            }
            <CoinNumber precision={2} className="post-state-count" value={amount * constants.fixedPoint} />
            <Popover
                placement="top"
                open={showPopOver}
                title="Tip Author"
                trigger="click"
                content={popoverContent}
            />
        </Space>
    );
};
TipIcon.propTypes = propTypes;
TipIcon.defaultProps = defaultProps;
export default TipIcon;
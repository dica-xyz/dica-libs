import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Space, Dropdown } from "antd";
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { blockchain } from '../../utils';
import { NeedLogin } from '../messageBox';
import BlockchainSponsorInfo from '../blockchainSponsorInfo';

const { TransactionTypes } = blockchain;

const propTypes = {
    parent: PropTypes.object.isRequired,
    user: PropTypes.object,
    apis: PropTypes.object,
    data: PropTypes.object
};
const defaultProps = {};
const LikeIcon = (props) => {
    const {
        parent: {
            commentId, sidechainId, commenter, status
        }, user, apis, data
    } = props;
    const { postStatApi, execApi } = apis;
    const [checked, setChecked] = useState();
    const [count, setCount] = useState(0);

    const statIt = async () => {
        if (!user.isLogin) {
            NeedLogin();
            return;
        }

        const stat = {
            parentId: commentId,
            author: { address: commenter.address },
            type: TransactionTypes.POSTLIKE,
            sidechainId: status === 4 ? sidechainId : null,
            ip: user.ip,
            secret: user.secret
        };
        execApi(
            (options)=> postStatApi(options).statIt(stat),
            (result) => {
                const _count = count + 1 * (result.data ? 1 : -1);
                setCount(_count);
                setChecked(_count > 0);
            }
        );
    };

    useEffect(() => {
        setCount(data.count);
        setChecked(data.checked);
    }, [data]);

    return (
        <Dropdown
            placement="top"
            arrow="false"
            size="middle"
            disabled={!sidechainId}
            menu={{
                items: [{
                    key: 'info',
                    label: (
                        <BlockchainSponsorInfo
                            transactionType={TransactionTypes.POSTLIKE}
                            sidechainId={sidechainId}
                        />
                    )
                }]
            }}
        >
            <Space direction="horizontal" size={0}>
                {
                    checked
                        ? (
                            <LikeFilled
                                onClick={() => statIt()}
                                className="comment-stat-icon-like comment-stat-icon-checked" />
                        )
                        : (
                            <LikeOutlined
                                onClick={() => statIt()}
                                className="comment-stat-icon-like comment-stat-icon"
                            />
                        )
                }
                <span className="comment-state-count">{count || 0}</span>
            </Space>
        </Dropdown>
    );
};
LikeIcon.propTypes = propTypes;
LikeIcon.defaultProps = defaultProps;
export default LikeIcon;
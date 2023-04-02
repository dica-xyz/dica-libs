import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Space, Dropdown
} from "antd";
import { DislikeOutlined, DislikeFilled } from '@ant-design/icons';
import { blockchain } from '../../utils';
import { NeedLogin } from '../messageBox';
import BlockchainSponsorInfo from '../blockchainSponsorInfo';

const { TransactionTypes } = blockchain;

const propTypes = {
    post: PropTypes.object.isRequired,
    user: PropTypes.object,
    apis: PropTypes.object,
    data: PropTypes.object
};
const defaultProps = {};
const DislikeIcon = (props) => {
    const {
        post: { postId, author, sidechainId, status },
        user, apis, data
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
            parentId: postId,
            author,
            type: TransactionTypes.POSTDISLIKE,
            sidechainId: status === 4 ? sidechainId : null,
            ip: user.ip,
            secret: user.secret
        };
        execApi(
            (options) => postStatApi(options).statIt(stat),
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
                            transactionType={TransactionTypes.POSTDISLIKE}
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
                            <DislikeFilled
                                onClick={() => statIt()}
                                className="post-stat-icon post-stat-icon-dislike post-stat-icon-checked" />
                        )
                        : (
                            <DislikeOutlined
                                onClick={() => statIt()}
                                className="post-stat-icon post-stat-icon-dislike"
                            />
                        )
                }
                <span className="post-state-count">{count || 0}</span>
            </Space>
        </Dropdown>
    );
};
DislikeIcon.propTypes = propTypes;
DislikeIcon.defaultProps = defaultProps;
export default DislikeIcon;
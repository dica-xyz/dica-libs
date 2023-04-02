/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Space, Button } from "antd";
import withApis from '../withApis';
import LikeIcon from './likeIcon';
import DislikeIcon from './dislikeIcon';
import TipIcon from './tipIcon';
import withComponentWrapper from '../withComponentWrapper';
import './styles.less';

const propTypes = {
    comment: PropTypes.object.isRequired,
    user: PropTypes.object,
    gap: PropTypes.number,
    className: PropTypes.string,
    apis: PropTypes.object,
    onReply: PropTypes.func,
    onStatInfo: PropTypes.func
};

const defaultProps = {
    gap: 16
};

const CommentStat = (props) => {
    const {
        comment: { commentId, status },
        gap, user, apis, onReply, onStatInfo
    } = props;
    const [statInfo, setStatInfo] = useState({
        comment: { count: 0 },
        liked: { checked: false, count: 0 },
        disliked: { checked: false, count: 0 },
        tip: { checked: false, amount: 0 }
    });
    const { postStatApi, execApi } = apis;

    useEffect(() => {
        execApi(
            (options) => postStatApi(options).statInfo({ parentId: commentId, address: user?.address }),
            (result) => {
                setStatInfo(result.data);
                onStatInfo(result.data);
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, commentId]);

    return (
        <div className="comment-stat">
            <Space
                direction="horizontal"
                size={gap}
                className="comment-stat-icons">
                <LikeIcon
                    {...props}
                    parent={{ ...props.comment, parentId: props.comment.commentId }}
                    data={statInfo.liked}
                />
                <DislikeIcon
                    {...props}
                    parent={{ ...props.comment, parentId: props.comment.commentId }}
                    data={statInfo.disliked}
                />
                {
                    status === 4 ?
                        (
                            <TipIcon
                                {...props}
                                parent={{ ...props.comment, parentId: props.comment.commentId }}
                                data={statInfo.tipped}
                            />
                        ) : null
                }
                <Button type="link" onClick={onReply}>Reply</Button>
            </Space>

        </div>
    );
};

CommentStat.propTypes = propTypes;
CommentStat.defaultProps = defaultProps;

export default withComponentWrapper(withApis(CommentStat));

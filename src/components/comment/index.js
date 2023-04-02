import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Space } from 'antd';
import { Comment } from '@ant-design/compatible';
import dayjs from 'dayjs';
import { EyeInvisibleOutlined } from '@ant-design/icons';
import utils from '../../utils';
import TextArea from '../textarea';
import TimeLabel from '../timeLabel';
import UserLink from '../userLink';
import withApis from '../withApis';
import { NeedLogin } from '../messageBox';
import withComponentWrapper from '../withComponentWrapper';
import CommentStat from '../commentStat';
import CommentPublishButton from '../commentPublishButton';
import CommentReply from '../commentReply';
import './styles.less';

const { PostStatus } = utils.constants;

const { slots } = utils.blockchain;
const propTypes = {
    content: PropTypes.object,
    user: PropTypes.object,
    apis: PropTypes.object,
    site: PropTypes.object,
    onHide: PropTypes.func
};

const defaultProps = {
    content: {},
};

const CommentDetail = (props) => {
    const {
        content, apis, user, site, onHide
    } = props;
    const { execApi, postApi } = apis;
    const {
        timestamp, commenter, commentId, status, parentId
    } = content;
    const [showCommentButton, setShowCommentButton] = useState(false);
    const [newComment, setNewComment] = useState();
    const [numberOfReply, setNumberOfReply] = useState();
    const hideComment = () => {
        if (!user.isLogin) {
            NeedLogin();
            return;
        }
        execApi(
            (options) => postApi(options).toggleComment({ commentId, status: 10, parentId, secret: user.secret }),
            () => onHide(commentId)
        );
    };

    if (!content) return null;

    return (
        <Comment
            className="dica-comment-item"
            author={(
                <UserLink
                    userData={commenter}
                    showAvatar={true}
                />
            )}
            content={
                (
                    <>
                        {
                            showCommentButton
                                ? (
                                    <div>
                                        <CommentPublishButton
                                            parent={{ ...content, parentId: commentId }}
                                            onNewComment={(c) => setNewComment(c)}
                                        />
                                    </div>
                                ) : null
                        }
                        <TextArea
                            readOnly={true}
                            autoSize={{ minRows: 1 }}
                            className="comment-content"
                            value={content.body} />
                        <CommentReply
                            parent={{ parentId: commentId }}
                            numberOfReply={numberOfReply}
                            newComment={newComment}
                        />
                    </>
                )
            }
            datetime={(
                <Space size={16}>
                    <Tooltip title={dayjs(Number(slots.getRealTime(timestamp))).format('YYYY-MM-DD HH:mm:ss')}>
                        <TimeLabel timestamp={timestamp} relativeTime={true} />
                    </Tooltip>
                    <CommentStat
                        comment={content}
                        onReply={() => setShowCommentButton(!showCommentButton)}
                        onStatInfo={(statInfo) => setNumberOfReply(statInfo?.comment?.count)}
                    />
                    {
                        user.address === site.schema.publication
                            ? (
                                <Tooltip key="hide" title="You hide it only on your publication. If it is on blockchain, it may still show up on other publications">
                                    <a
                                        role="presentation"
                                        onClick={() => hideComment(status | PostStatus.DECLINED)}
                                        className="hide-icon"
                                    >
                                        <EyeInvisibleOutlined />
                                        hide
                                    </a>
                                </Tooltip>
                            ) : null
                    }
                </Space>
            )}
        />
    );
};

CommentDetail.propTypes = propTypes;

CommentDetail.defaultProps = defaultProps;

export default withComponentWrapper(withApis(CommentDetail));

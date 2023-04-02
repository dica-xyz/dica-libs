/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Space } from 'antd';
import withApis from '../withApis';
import Button from '../button';
import { MessageBox, NeedLogin } from '../messageBox';
import TextArea from '../textarea';
import BlockchainButton from '../blockchainButton';
import withComponentWrapper from '../withComponentWrapper';
import utils from '../../utils';

const { shortId, blockchain: { TransactionTypes } } = utils;

const propTypes = {
    apis: PropTypes.object,
    user: PropTypes.object,
    intl: PropTypes.object,
    parent: PropTypes.object,
    site: PropTypes.object,
    onNewComment: PropTypes.func,
};

const defaultProps = {};

const CommentPublishButton = (props) => {
    const {
        user, parent, site, intl,
        onNewComment, apis
    } = props;
    const { commentApi, execApi } = apis;
    const [disabled, setDisabled] = useState(false);
    const [reply, setReply] = useState('');
    const [isLocal, setIsLocal] = useState();

    useEffect(() => {
        setIsLocal(!parent.sidechainId);
    }, [parent.sidechainId, parent.transactionId, site]);

    const onValidation = (cb) => {
        if (!user.isLogin) {
            NeedLogin();
            if (cb) { return cb(true); }
            return true;
        }

        if (!parent.parentId) {
            return cb(intl.formatMessage({ id: 'post.postIdNotFound' }));
        }
        if (!(reply?.length >= 10)) {
            MessageBox({ title: 'Comment is too short. 10 char minimum.', type: 'error' });
            if (cb) { return cb(true); }
            return true;
        }
        if (cb) { return cb(false); }
        return false;
    };

    const postComment = async ({ secondSecret }) => {
        const _comment = {
            parentId: parent.parentId,
            commentId: shortId({ length: 10 }),
            sidechainId: parent.sidechainId,
            body: reply,
            author: (parent.author || parent.commenter).address,
            secret: user.secret,
            secondSecret,
        };

        if (isLocal) {
            execApi(
                (options) => commentApi(options).saveComment(_comment),
                (result) => {
                    onNewComment && onNewComment({
                        commentId: _comment.commentId,
                        body: reply,
                        commenter: user,
                        timestamp: result.data.timestamp,
                    });
                    MessageBox({
                        title: intl.formatMessage({ id: 'post.CommentSuccessfulTitle' }),
                        body: intl.formatMessage({ id: 'post.commentPostLocally' }),
                        type: 'success',
                    });
                    setDisabled(true);
                    setReply('');
                }
            );
        } else {
            execApi(
                (options) => commentApi(options).broadcast(_comment),
                (result) => {
                    onNewComment({
                        commentId: _comment.commentId,
                        body: reply,
                        commenter: user,
                        timestamp: result.data.timestamp,
                    });
                    MessageBox({
                        title: intl.formatMessage({ id: 'post.CommentSuccessfulTitle' }),
                        body: intl.formatMessage({ id: 'post.commentPostSucceeded' }),
                        type: 'success',
                    });
                    setDisabled(true);
                    setReply('');
                }
            );
        }
    };

    return (
        <div className="comment-publish-button">
            <Space direction="vertical" style={{ width: '100%' }}>
                <TextArea
                    autoSize={{ minRows: 1, maxRows: 12 }}
                    onChange={(e) => setReply(e.target.value)}
                    value={reply} />
                {
                    isLocal
                        ? <Button type="default" onClick={() => { if (!onValidation()) { postComment({}); } }}>Add comment</Button>
                        : (
                            <BlockchainButton
                                disabled={disabled || false}
                                type="primary"
                                transactionType={TransactionTypes.POSTCOMMENT}
                                sidechainId={parent.sidechainId}
                                confirmationMessage={(
                                    <ul>
                                        <li>
                                            Your comment will be broadcasted to blockchain.
                                            After publishing, you can NOT edit or delete it, nor anyone else.
                                        </li>
                                        <li>
                                            By clicking Ok,
                                            you agree to publish your comment under
                                            <a
                                                href="https://creativecommons.org/licenses/"
                                                target="_blank"
                                                rel="noopener"
                                            >
                                                {` Creative Commons (CC BY-SA) license`}
                                            </a>
                                            .
                                        </li>
                                        <li>
                                            You own the content you publish on
                                            DICA CMS and blockchain.
                                            And you also take 100% responsibilities
                                            of your content,
                                            including but no limited to accuracy,
                                            intellectual property and all other legal rights.
                                        </li>
                                    </ul>
                                )}
                                onValidation={onValidation}
                                onSubmit={postComment}
                                className="inline-btn"
                                buttonText="Add comment"
                            />
                        )
                }
            </Space>
        </div>
    );
};

CommentPublishButton.propTypes = propTypes;

CommentPublishButton.defaultProps = defaultProps;

export default withComponentWrapper(withApis(CommentPublishButton));

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd';
import Comment from '../comment/';
import './styles.less';

const propTypes = {
    comments: PropTypes.array
};

const defaultProps = {};

const Comments = (props) => {
    const { comments } = props;
    const [datasource, setDatasource] = useState();
    useEffect(() => {
        setDatasource(comments);
    }, [comments]);

    return (
        comments?.length > 0
            ? (
                <List
                    className="dica-comments"
                    itemLayout="vertical"
                    size="large"
                    dataSource={datasource}
                    renderItem={(comment) => (
                        <List.Item className="comment-list-item" key={comment.commentId}>
                            <Comment
                                onHide={(commentId) => setDatasource(comments.filter((c) => c.commentId !== commentId))}
                                content={comment} />
                        </List.Item>
                    )}
                />
            ) : null
    );
};

Comments.propTypes = propTypes;

Comments.defaultProps = defaultProps;

export default Comments;

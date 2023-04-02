import React from 'react';
import PropTypes from 'prop-types';
import { Space } from "antd";
import { MessageOutlined } from '@ant-design/icons';
import Link from '../link';

const propTypes = {
    data: PropTypes.object,
};
const defaultProps = {};
const CommentIcon = (props) => {
    const { data, post: { postUrl } } = props;

    return postUrl
        ? (
            <Link
                className="post-stat-icon-comment dica-anchor"
                to={`${postUrl}#post-comments`}
                icon={
                    (
                        <>
                            <MessageOutlined
                                title="comments"
                                className="post-stat-icon" />
                            <span className="post-state-count">{data.count ?? 0}</span>
                        </>
                    )
                }
            />
        )
        : (
            <a
                className="post-stat-icon-comment dica-anchor"
                href={`#post-comments`}

            >{
                    (
                        <>
                            <MessageOutlined
                                title="comments"
                                className="post-stat-icon" />
                            <span className="post-state-count">{data.count ?? 0}</span>
                        </>
                    )
                }
            </a>
        );
};
CommentIcon.propTypes = propTypes;
CommentIcon.defaultProps = defaultProps;
export default CommentIcon;
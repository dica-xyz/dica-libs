import React from 'react';
import PropTypes from 'prop-types';
import { BlockOutlined } from '@ant-design/icons';
import Link from '../link';
import { url } from '../../utils';
import "./styles.less";

const propTypes = {
    post: PropTypes.object,
    url: PropTypes.string
};
const defaultProps = {};
const PostTitle = (props) => {
    const { post, url: pUrl } = props;
    const {
        title, postId
    } = post;

    const _url = `/post/${postId}/${title}`;

    return (
        <div className="post-title">
            <Link className="post-title-url" to={url.urlEncode(pUrl || _url)}>
                {title}
            </Link>
            {post.status === 4 ? <BlockOutlined className="post-title-icon" title="Published in blockchain" /> : null}
        </div>
    );
};
PostTitle.propTypes = propTypes;
PostTitle.defaultProps = defaultProps;
export default PostTitle;
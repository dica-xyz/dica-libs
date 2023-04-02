import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import withApis from '../withApis';
import './styles.less';

const propTypes = {
    apis: PropTypes.object,
    postId: PropTypes.string
};
const defaultProps = {};
const PostViewCounts = (props) => {
    const { apis, postId } = props;
    const { postApi, execApi } = apis;
    const [count, setCount] = useState();

    useEffect(() => {
        if (!postId) return;
        execApi(
            (options) => postApi(options).getViewCounts(postId),
            (result) => setCount(result.data.count || 0)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    return count ? (
        <span className="post-view-count">
            Views:
            {' '}
            {count}
        </span>
    ) : null;
};
PostViewCounts.propTypes = propTypes;
PostViewCounts.defaultProps = defaultProps;
export default withApis(PostViewCounts);
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    List, Alert
} from 'antd';
import Link from '../../link';
import FeedStyles from '../feedStyles';
import { shortId, url } from '../../../utils';

const propTypes = {
    loading: PropTypes.bool,
    hasMore: PropTypes.bool,
    showHeader: PropTypes.bool,
    feedId: PropTypes.string,
    posts: PropTypes.array,
    itemStyle: PropTypes.string,
    pageSize: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string]),
    title: PropTypes.string,
    titleUrl: PropTypes.string,
    pageIndex: PropTypes.number,
    setPageIndex: PropTypes.func
};

const defaultProps = {
    pageSize: 10,
    title: "",
};

const FeedInfiniteLoading = (props) => {
    const [scrollableDivId] = useState(shortId());
    const {
        feedId, setPageIndex, hasMore,
        title, loading, posts,
        showHeader, titleUrl, pageIndex
    } = props;

    return (
        <div style={{ width: '100%', height: '100%', marginRight: "10px" }} id={scrollableDivId}>
            <InfiniteScroll
                dataLength={posts.length}
                next={() => setPageIndex(pageIndex + 1)}
                hasMore={hasMore}
                scrollableTarget={scrollableDivId}
            >
                <List
                    header={
                        (showHeader && title) ? titleUrl?.length > 0 ? (
                            <Link
                                to={titleUrl.replace(':feedId', feedId).replace(':title', url.urlEncode(title))}
                            >
                                <h2>{` ${title} `}</h2>
                            </Link>
                        ) : <h2>{` ${title} `}</h2>
                            : null
                    }
                    itemLayout="vertical"
                    size="small"
                    split={false}
                    loading={loading}
                    dataSource={posts}
                    rowKey="postId"
                    renderItem={
                        (post) => (
                            <FeedStyles
                                post={post}
                                key={post.postId}
                                {...props}
                            />
                        )
                    }
                />
            </InfiniteScroll>
        </div>
    );
};

FeedInfiniteLoading.propTypes = propTypes;
FeedInfiniteLoading.defaultProps = defaultProps;

export default FeedInfiniteLoading;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { List, Empty } from 'antd';
import { useParams } from 'react-router-dom';
import Link from '../../link';
import { url } from '../../../utils';
import FeedStyles from '../feedStyles';
import '../styles.less';

const propTypes = {
    feedId: PropTypes.string,
    pageIndex: PropTypes.number,
    savePostToStore: PropTypes.func,
    onLoaded: PropTypes.func,
    loadingType: PropTypes.string,
    pageSize: PropTypes.oneOfType([PropTypes.number,
    PropTypes.string]),
    posts: PropTypes.array,
    apis: PropTypes.object,
    ssrProps: PropTypes.object,
    loadMore: PropTypes.object,
    postStore: PropTypes.object,
    title: PropTypes.string,
    titleUrl: PropTypes.string,
    moduleId: PropTypes.string,
    postPerRow: PropTypes.object,
    showHeader: PropTypes.bool,
    loading: PropTypes.bool
};

const defaultProps = {
    showHeader: true,
    feedId: '',
    loadMore: null,
    pageIndex: 0,
    loadingType: 'none',
    pageSize: 10,
    title: '',
    titleUrl: '',
    postPerRow: {
        md: 1, lg: 1, xl: 1, xxl: 1
    }
};

const FeedPage = (props) => {
    const {
        feedId,
        titleUrl,
        loadMore,
        posts,
        title: pTitle,
        showHeader,
        postPerRow,
        loading
    } = props;
    const params = useParams();
    const [title] = useState(pTitle || params.title);

    return posts?.length
        ? (
            <div className="feed-page">
                <List
                    grid={{ gutter: 8, ...postPerRow }}
                    header={
                        showHeader && title ? titleUrl && titleUrl.length > 0 ? (
                            <Link to={
                                titleUrl.replace(':feedId', feedId).replace(':title', url.urlEncode(title))
                            }
                            >
                                <h2>{` ${title} `}</h2>
                            </Link>
                        ) : <h2>{` ${title} `}</h2>
                            : null
                    }
                    itemLayout="vertical"
                    size="small"
                    locale={{ emptyText: <Empty description="No posts" /> }}
                    split={false}
                    loading={loading}
                    rowKey="postId"
                    loadMore={loadMore}
                    dataSource={
                        // Add itemIndex to dataSource
                        posts?.map((post, itemIndex) => ({
                            ...post, itemIndex
                        }
                        ))
                    }
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
            </div>
        ) : null;
};
FeedPage.propTypes = propTypes;
FeedPage.defaultProps = defaultProps;
export default FeedPage;
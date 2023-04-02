import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import { useParams } from 'react-router-dom';
import withPagination from '../withPagination';
import feedApi from '../../../apis/feedApi';
import FeedListPage from '../page';
import FeedInfiniteLoading from '../infinite';
import FeedCarousel from '../carousel';
import loadFile from '../utils';

const propTypes = {
    posts: PropTypes.array,
    title: PropTypes.string,
    loadingType: PropTypes.string,
    postStore: PropTypes.object,
    feedId: PropTypes.string,
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number,
    onLoaded: PropTypes.func,
    savePostToStore: PropTypes.func,
    apis: PropTypes.object,
    ssrProps: PropTypes.object,
    moduleId: PropTypes.string
};

const defaultProps = {
    ssrProps: {}
};

export const getPostsByFeedId = async ({ pageIndex, pageSize, feedId }, options) => {
    const result = await feedApi(options).getPostsByFeedId({
        feedId, pageSize, pageIndex
    });

    if (result?.data?.data?.length > 0) {
        return result.data.data.sort((a, b) => a.priority - b.priority);
    }
    return null;
};

const FeedList = (props) => {
    const {
        feedId,
        loadingType,
        ssrProps,
        moduleId,
        pageSize,
        postStore,
        savePostToStore,
        pageIndex,
        onLoaded
    } = props;

    const [posts, setPosts] = useState(ssrProps[moduleId]?.data || []);

    const loadPost = (post) => {
        const existingPost = postStore?.postContents?.length
            ? postStore.postContents.find((p) => p.postId === post.postId) : null;
        if (existingPost) { // check store first
            return existingPost;
        }

        return loadFile(post);
    };
    const params = useParams();

    const loadPosts = async (_pageIndex) => {
        let _feedId = feedId;
        if (!_feedId) return;
        if (_feedId === ':feedId') {
            _feedId = params.feedId;
        }

        let _posts = await getPostsByFeedId({
            feedId: _feedId,
            pageSize: Number(pageSize),
            pageIndex: _pageIndex ?? pageIndex
        });
        _posts = _posts?.map((post) => {
            const _post = loadPost(post);
            // don't cache paid posts
            if (_post.options.payment?.price === 0) {
                savePostToStore(_post);
            }
            return _post;
        });

        if (loadingType === 'page') {
            setPosts(_posts);
        } else {
            setPosts([...posts, ..._posts]);
        }

        onLoaded(!!_posts);
    };
    useEffect(() => {
        // for ssr, datasource is loaded at server side,
        // no need to load at client side again
        if (ssrProps[moduleId]) { return; }

        loadPosts();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feedId, pageIndex]);

    if (!feedId) {
        return (
            <Alert
                message="FeedId is missing"
                description="To populate a feed, assign it a feedId."
                type="error" />
        );
    }

    switch (loadingType) {
        case 'infinite_loading':
            return (
                <FeedInfiniteLoading
                    {...props} l
                    posts={posts}
                />
            );
        case 'carousel':
            return <FeedCarousel {...props} posts={posts} />;
        default:
            return <FeedListPage {...props} posts={posts} />;
    }
};

FeedList.propTypes = propTypes;
FeedList.defaultProps = defaultProps;
FeedList.displayName = 'FeedList';

/**
 * This function is executed on server side. 
 * Anything returned from this function will be directly passed to ssrProps[moduleId] of component's props
 *
 * @export 
 * @param {*} props
 * @returns {*} 
 */
export const getSsrProps = async (props, options) => {
    const { pageSize, feedId } = props;
    const posts = await getPostsByFeedId({
        feedId,
        pageSize: Number(pageSize),
        pageIndex: 0
    }, options);

    return { data: posts?.map((post) => loadFile(post)) };
};

export default withPagination(FeedList);

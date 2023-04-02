import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Row, Col, Empty } from 'antd';
import postApi from '../../../apis/postApi';
import SearchBar from '../../searchBar';
import FeedListPage from '../page';
import FeedInfiniteLoading from '../infinite';
import FeedCarousel from '../carousel';
import withPagination from '../withPagination';
import { GlobalContext } from '../../../context';
import loadFile from '../utils';
import './styles.less';

const propTypes = {
    apis: PropTypes.object,
    pageIndex: PropTypes.number,
    search: PropTypes.string,
    pageSize: PropTypes.number,
    loadingType: PropTypes.string,
    showSearchBar: PropTypes.bool,
    onLoaded: PropTypes.func,
    onNewSearch: PropTypes.func,
    savePostToStore: PropTypes.func,
    postStore: PropTypes.object,
    ssrProps: PropTypes.object,
    moduleId: PropTypes.string
};

const defaultProps = {
    ssrProps: {},
    pageIndex: 0,
    pageSize: 10,
    showSearchBar: true
};

const prepareSearch = (query) => {
    if (!query?.length) {
        return [];
    }

    const arraySearch = query.split(/[ -]+/);
    const keywords = [];
    const addresses = [];
    const postIds = [];

    arraySearch.forEach((element) => {
        if (element.trim() === '') { return; }

        if (/^D[0-9]{1,22}$/i.test(element)) {
            addresses.push(element);
        } else if (element.length === 10) {
            postIds.push(element);
        } else {
            keywords.push(element);
        }
    });

    return {
        keywords,
        addresses,
        postIds
    };
};

const doSearch = async (_params, options) => {
    const result = await postApi(options).search(_params);
    if (result?.data?.data?.length) {
        return result.data.data;
    }

    return [];
};

const FeedSearch = (props) => {
    const {
        onNewSearch, loadingType, postStore, ssrProps, moduleId,
        showSearchBar, search: pSearch, onLoaded,
        pageIndex: pPageIndex, pageSize, savePostToStore
    } = props;
    const params = useParams();
    const initialSearch = pSearch ?? params?.query?.replace('-', ' ');
    const [posts, setPosts] = useState(ssrProps[moduleId]?.data ?? []);
    const [loading, setLoading] = useState(!ssrProps[moduleId]?.data); // if ssr loading, don't show loading icon
    const [pageIndex, setPageIndex] = useState(pPageIndex ?? 0);
    const [search, setSearch] = useState(initialSearch);
    const searched = useRef(false);
    const ssrLoad = useRef(!!ssrProps[moduleId]);
    const { httpOptions } = useContext(GlobalContext);

    const _doSearch = async () => {
        const _params = prepareSearch(search);
        const {
            keywords, addresses, postIds
        } = _params;
        let _posts;
        if (keywords?.length || addresses?.length
            || postIds?.length) {
            _posts = await doSearch({
                ..._params,
                pageIndex,
                pageSize
            }, httpOptions);
            if (_posts) {
                _posts = _posts.map((p) => {
                    const _p = loadPost(p);
                    savePostToStore(_p);
                    return _p;
                });
                if (loadingType === 'load_more') {
                    setPosts([...posts, ..._posts]);
                } else {
                    setPosts(_posts);
                }
            } else {
                setPosts([]);
            }
        }
        setLoading(false);
        searched.current = true;
        onLoaded(!!_posts);
    };

    const onSearch = (value) => {
        ssrLoad.current = false;
        setLoading(true);
        onNewSearch();
        setPageIndex(0);
        setSearch(value);
    };

    const loadPost = (post) => {
        const existingPost = postStore?.postContents?.length
            ? postStore.postContents.find((p) => p.postId === post.postId) : null;
        if (existingPost) { // check store first
            return existingPost;
        }

        return loadFile(post);
    };

    useEffect(() => {
        // for ssr, datasource is loaded at server side,
        // no need to load at client side again
        if (search?.length && !ssrLoad.current) {
            _doSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const getListStyle = () => {
        switch (loadingType) {
            case 'infinite_loading':
                return <FeedInfiniteLoading {...props} loading={loading} posts={posts} />;
            case 'carousel':
                return <FeedCarousel {...props} loading={loading} posts={posts} />;
            default:
                return <FeedListPage {...props} loading={loading} posts={posts} />;
        }
    };

    return (
        <div className="post-search">
            {
                !showSearchBar ? null
                    : (
                        <Row>
                            <Col
                                md={{ span: 24 }}
                                lg={{ span: 22, offset: 1 }}
                                xl={{ span: 20, offset: 2 }}
                            >
                                <SearchBar
                                    onSearch={onSearch}
                                    value={search}
                                    placeholder="Search posts by title, tags, post id or author's address/name"
                                />
                            </Col>
                        </Row>
                    )
            }

            {
                posts?.length === 0
                    ? searched.current ? <Empty description="Nothing found" /> : null
                    : (
                        <div>
                            {
                                getListStyle()
                            }
                        </div>
                    )
            }
        </div>
    );
};

FeedSearch.propTypes = propTypes;
FeedSearch.defaultProps = defaultProps;

/**
 * Return search result
 *
 * @param {*} {match} get query from url
 * @returns
 */
export const getSsrProps = async (props, options) => {
    const { match, pageSize } = props;
    const _params = prepareSearch(match.params.query);
    const _posts = await doSearch({
        ..._params,
        pageIndex: 0,
        pageSize
    }, options);

    return { data: _posts?.map((post) => loadFile(post)) ?? [] };
};

export default withPagination(FeedSearch);

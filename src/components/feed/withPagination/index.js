import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './styles.less';

const WithPagination = (WrappedComponent) => {
    const WrappedListClass = (props) => {
        const { loadingType, pageSize, loadMoreText } = props;
        const [showButton, setShowButton] = useState(null);
        const [hasMore, setHasMore] = useState(false);
        const [pageIndex, setPageIndex] = useState(0);

        const onNewSearch = () => {
            setPageIndex(0);
        };

        const onLoadMore = () => {
            setPageIndex(pageIndex + 1);
        };

        const onPrevPage = () => {
            setPageIndex(Math.max(pageIndex - 1, 0));
        };

        const onNextPage = () => {
            setPageIndex(pageIndex + 1);
        };

        const loadMore = hasMore ? (
            <div className="feed-loadmore-button">
                <Button onClick={onLoadMore}>
                    {loadMoreText}
                </Button>
            </div>
        ) : null;

        const turnPage = (
            <div className="feed-pagination-button">
                <Button
                    className="pre-pge"
                    disabled={pageIndex === 0}
                    onClick={onPrevPage}
                    icon={<LeftOutlined />}
                />
                <Button
                    className="next-page"
                    disabled={!hasMore}
                    onClick={onNextPage}
                    icon={<RightOutlined />}
                />
            </div>
        );
        // After retrieve data from backend
        const onLoaded = (datasource) => {
            if (showButton === null) {
                setShowButton(datasource?.length >= pageSize);
            }
            setHasMore(datasource?.length >= pageSize);
        };

        const loadMoreButtons = () => {
            if (!showButton) return null;

            switch (loadingType) {
                case 'load_more':
                    return loadMore;
                case 'page':
                    return turnPage;
                default:
                    return null;
            }
        };

        return (
            <WrappedComponent
                {...props}
                onNewSearch={onNewSearch}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                loadMore={loadMoreButtons()}
                onLoaded={onLoaded}
                hasMore={hasMore}
            />
        );
    };
    WrappedListClass.propTypes = {
        loadMoreText: PropTypes.string,
        loadingType: PropTypes.string,
        pageSize: PropTypes.number,
        bordered: PropTypes.bool,
        title: PropTypes.string,
    };

    WrappedListClass.defaultProps = {
        loadMoreText: 'load more',
        loadingType: null,
        pageSize: 10,
        bordered: false,
        title: '',
    };
    return WrappedListClass;
};

export default WithPagination;

import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import FeedList, { getPostsByFeedId } from '../feedList';
import loadFile from '../utils';
import './styles.less';

const propTypes = {
    tabs: PropTypes.array,
    ssrProps: PropTypes.object,
    moduleId: PropTypes.string
};
const defaultProps = {};
const FeedTab = (props) => {
    const { tabs,
        ssrProps,
        moduleId } = props;
    const items = tabs.map((tab) => ({
        label: tab.title,
        key: tab.title,
        children: (
            <FeedList
                showHeader={false}
                {...{
                    ...tab,
                    ...tab?.additionalProps,
                    ssrProps,
                    moduleId
                }}
            />
        )
    }));

    return tabs?.length && (
        <Tabs
            className="feed-tabs"
            items={items}
        />
    );
};
FeedTab.propTypes = propTypes;
FeedTab.defaultProps = defaultProps;

/**
 * This function is executed on server side. 
 * Anything returned from this function will be directly passed to ssrProps[moduleId] of component's props
 *
 * @export 
 * @param {*} props
 * @returns {*} 
 */
export const getSsrProps = async (props, options) => {
    const { tabs } = props;
    if (tabs?.length) {
        // server rendering first tab
        const { feedId, pageSize } = tabs[0];
        const posts = await getPostsByFeedId({
            feedId,
            pageSize: Number(pageSize),
            pageIndex: 0
        }, options);

        return { data: posts?.map((post) => loadFile(post)) };
    }
    return { data: [] };
};


export default FeedTab;
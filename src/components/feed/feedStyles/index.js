import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton } from 'antd';
import { url } from '../../../utils';
import FeedStyle1 from './feedStyle1';
import FeedStyle2 from './feedStyle2';
import FeedStyle3 from './feedStyle3';
import FeedStyle4 from './feedStyle4';
import FeedStyle6 from './feedStyle6';
import ShortPostStyle from './shortPostStyle';

const propTypes = {
    postStore: PropTypes.object,
    post: PropTypes.object,
    postUrl: PropTypes.string,
    itemStyle: PropTypes.string,
    imageContainerHeight: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    imageContainerWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    imageHeight: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    imageWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

const defaultProps = {
    itemStyle: "feedStyle2",
    postUrl: "/post/:postId/:postTitle",
    imageContainerHeight: "200px",
    imageContainerWidth: "200px",
    imageHeight: "200",
    imageWidth: "400"
};

const feedStyles = (props) => {
    const {
        post, postStore, itemStyle,
        postUrl: pPostUrl, ...rest
    } = props;

    if (!post) return <Skeleton />;

    const postUrl = pPostUrl.replace(':postId', post.postId).replace(':postTitle', url.urlEncode(post.title));
    let FeedStyle;

    if (post.options.type === 1) {
        FeedStyle = <ShortPostStyle post={post} {...{ ...rest, postUrl }} />
    } else {
        switch (itemStyle) {
            case 'feedStyle1':
                FeedStyle = <FeedStyle1 post={post} {...{ ...rest, postUrl }} />;
                break;
            case 'feedStyle2':
                FeedStyle = <FeedStyle2 post={post} {...{ ...rest, postUrl }} />;
                break;
            case 'feedStyle3':
                FeedStyle = <FeedStyle3 post={post} {...{ ...rest, postUrl }} />;
                break;
            case 'feedStyle4':
                FeedStyle = <FeedStyle4 post={post} {...{ ...rest, postUrl }} />;
                break;
            case 'feedStyle6':
                FeedStyle = <FeedStyle6 post={post} {...{ ...rest, postUrl }} />;
                break;
            default:
                FeedStyle = <FeedStyle2 post={post} {...{ ...rest, postUrl }} />;
                break;
        }
    }
    return FeedStyle;
};

feedStyles.propTypes = propTypes;
feedStyles.defaultProps = defaultProps;

export default feedStyles;

import React from 'react';
import PropTypes from 'prop-types';
import {
    List, Space, Card
} from 'antd';
import TimeLabel from '../../../timeLabel';
import UserLink from '../../../userLink';
import FeatureImage from '../../../featureImage';
import PostTitle from '../../../postTitle';
import PostSummary from '../../postSummary';
import PostStat from '../../../postStat';
import './styles.less';
import '../../styles.less';

const propTypes = {
    post: PropTypes.object,
    showIndex: PropTypes.bool,
    postUrl: PropTypes.string,
    imageContainerHeight: PropTypes.string,
    imageContainerWidth: PropTypes.string,
    imageHeight: PropTypes.string,
    imageWidth: PropTypes.string,
};

const defaultProps = {};

/**
 * Image @ Right
 *
 * @param {*} props
 * @returns
 */
const PostItemStyle1 = (props) => {
    const {
        post,
        postUrl,
        showIndex,
        imageContainerHeight,
        imageContainerWidth,
        imageHeight,
        imageWidth
    } = props;

    const {
        postId, timestamp, featureImage,
        author, summary, priority, itemIndex
    } = post;

    return (
        <List.Item
            className={`feed-style1 ${priority === 5 ? 'highlightItem' : 'item-image-right'}`}
            key={postId}
        >
            <Card
                bordered={false}
                cover={<TimeLabel timestamp={timestamp} relativeTime={true} />}
            >
                <Card.Meta
                    title={
                        <Space direction="horizontal">
                            {
                                showIndex ? <h1 className="post-index">{String(itemIndex + 1).padStart(2, '0')}</h1> : null
                            }
                            <div className="space-between">
                                <PostTitle post={post} url={postUrl} />
                                <FeatureImage
                                    url={postUrl}
                                    imageSrc={featureImage}
                                    {...{
                                        imageContainerHeight,
                                        imageContainerWidth,
                                        imageHeight,
                                        imageWidth
                                    }}
                                />
                            </div>
                        </Space>
                    }
                    description={
                        (
                            <>
                                <PostSummary summary={summary} />
                                <div className="space-between">
                                    <UserLink {...author} avatarSize={32} />
                                    <PostStat
                                        post={{ ...post, postUrl }}
                                    />
                                </div>
                            </>
                        )
                    }
                />
            </Card>
        </List.Item>
    );
};

PostItemStyle1.propTypes = propTypes;

PostItemStyle1.defaultProps = defaultProps;

export default PostItemStyle1;

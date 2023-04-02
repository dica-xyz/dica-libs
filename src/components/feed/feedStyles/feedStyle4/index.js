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
import '../../styles.less';
import './styles.less';

const propTypes = {
    post: PropTypes.object,
    postUrl: PropTypes.string,
    showIndex: PropTypes.bool,
    imageContainerHeight: PropTypes.string,
    imageContainerWidth: PropTypes.string,
    imageHeight: PropTypes.string,
    imageWidth: PropTypes.string,
};

const defaultProps = {
};

/**
 * Image @ Left
 *
 * @param {*} props
 * @returns
 */
const PostItemStyle4 = (props) => {
    const {
        post,
        postUrl,
        showIndex,
        imageContainerHeight,
        imageContainerWidth,
        imageHeight,
        imageWidth,
    } = props;

    const {
        postId, timestamp, featureImage,
        author, summary, priority, itemIndex
    } = post;

    return (
        <List.Item
            className={`feed-style4 ${priority === 5 ? 'highlightItem' : 'item-image-left'}`}
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
                            <PostTitle post={post} url={postUrl} />
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

PostItemStyle4.propTypes = propTypes;

PostItemStyle4.defaultProps = defaultProps;

export default PostItemStyle4;

import React from 'react';
import PropTypes from 'prop-types';
import { Space, List, Card } from 'antd';
import TimeLabel from '../../../timeLabel';
import FeatureImage from '../../../featureImage';
import UserLink from '../../../userLink';
import PostStat from '../../../postStat';
import PostTitle from '../../../postTitle';
import './styles.less';
import '../../styles.less';

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
 * Title inside image
 *
 * @param {*} props
 * @returns
 */
const PostItemStyle6 = (props) => {
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
        postId, title, timestamp, author,
        priority, featureImage, itemIndex
    } = post;

    return (
        <List.Item
            className={`feed-style6 ${priority === 5 ? 'highlightItem' : 'item-image-top'}`}
            key={postId}
        >
            <Card
                bordered={false}
                cover={<TimeLabel timestamp={timestamp} relativeTime={true} />}
            >
                <Card.Meta
                    title={(
                        <Space direction="horizontal">
                            {
                                showIndex ? <h1 className="post-index">{String(itemIndex + 1).padStart(2, '0')}</h1> : null
                            }
                            {
                                featureImage
                                    ? (
                                        <FeatureImage
                                            title={title}
                                            url={postUrl}
                                            imageSrc={featureImage}
                                            {...{
                                                imageContainerHeight,
                                                imageContainerWidth,
                                                imageHeight,
                                                imageWidth
                                            }}
                                        />
                                    ) : <PostTitle post={post} url={postUrl} />
                            }
                        </Space>
                    )}
                    description={
                        (
                            <div className="title-state">
                                <UserLink {...author} avatarSize={32} />
                                <PostStat
                                    post={{ ...post, postUrl }}
                                />
                            </div>
                        )
                    }
                />
            </Card>
        </List.Item>
    );
};

PostItemStyle6.propTypes = propTypes;

PostItemStyle6.defaultProps = defaultProps;

export default PostItemStyle6;

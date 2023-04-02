import React from 'react';
import PropTypes from 'prop-types';
import {
    List, Card, Space
} from 'antd';
import TimeLabel from '../../../timeLabel';
import UserLink from '../../../userLink';
import PostTitle from '../../../postTitle';
import FeatureImage from '../../../featureImage';
import PostSummary from '../../postSummary';
import PostStat from '../../../postStat';
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
 * Image @ top
 *
 * @param {*} props
 * @returns
 */
const PostItemStyle2 = (props) => {
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
            className={`feed-style2 ${priority === 5 ? 'highlightItem' : 'item-image-top'}`}
            key={postId}
        >
            <Card
                bordered={false}
                cover={
                    (
                        <>
                            <TimeLabel timestamp={timestamp} relativeTime={true} />
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
                        </>
                    )
                }
            >
                <Card.Meta
                    title={(
                        <Space direction="horizontal">
                            {
                                showIndex ? <h1 className="post-index">{String(itemIndex + 1).padStart(2, '0')}</h1> : null
                            }
                            <PostTitle post={post} url={postUrl} />
                        </Space>
                    )
                    }
                    description={
                        (
                            <>
                                <PostSummary summary={summary} />
                                <div className="title-state">
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

PostItemStyle2.propTypes = propTypes;

PostItemStyle2.defaultProps = defaultProps;

export default PostItemStyle2;

import React from 'react';
import PropTypes from 'prop-types';
import {
    List, Space, Card
} from 'antd';
import TimeLabel from '../../../timeLabel';
import UserLink from '../../../userLink';
import PostTitle from '../../../postTitle';
import PostSummary from '../../postSummary';
import PostStat from '../../../postStat';
import '../../styles.less';

const propTypes = {
    post: PropTypes.object,
    postUrl: PropTypes.string,
    showIndex: PropTypes.bool
};

const defaultProps = {};

/**
 * No Image
 *
 * @param {*} props
 * @returns
 */
const PostItemStyle3 = (props) => {
    const {
        post, postUrl, showIndex
    } = props;

    const {
        postId, timestamp, itemIndex,
        author, summary, priority
    } = post;


    return (
        <List.Item
            className={`feed-style3 ${priority === 5 ? 'highlightItem' : 'item-image'}`}
            key={postId}
        >
            <Card
                bordered={false}
                cover={<TimeLabel timestamp={timestamp} relativeTime={true} />}
            >
                <Card.Meta
                    title={
                        (
                            <Space direction="horizontal">
                                {showIndex ? <h1 className="post-index">{String(itemIndex + 1).padStart(2, '0')}</h1> : null}
                                <PostTitle post={post} url={postUrl} />
                            </Space>
                        )}
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

PostItemStyle3.propTypes = propTypes;

PostItemStyle3.defaultProps = defaultProps;

export default PostItemStyle3;

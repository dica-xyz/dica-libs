import React from 'react';
import PropTypes from 'prop-types';
import { List, Space, Card } from 'antd';
import TimeLabel from '../../../timeLabel';
import UserLink from '../../../userLink';
import Link from '../../../link';
import Rtb from '../../../richTextBox';
import PostStat from '../../../postStat';
import './styles.less';
import '../../styles.less';

const propTypes = {
    post: PropTypes.object,
    postUrl: PropTypes.string,
    showIndex: PropTypes.bool
};

const defaultProps = {
};

/**
 * short post
 *
 * @param {*} props
 * @returns
 */
const ShortPostStyle = (props) => {
    const {
        post, postUrl, showIndex
    } = props;

    const {
        postId, timestamp, body,
        author, priority, itemIndex
    } = post;

    return (
        <List.Item
            className={`short-post ${priority === 5 ? 'highlightItem' : 'item-image-top'}`}
            key={postId}
        >
            <Card
                bordered={false}
                cover={<TimeLabel timestamp={timestamp} relativeTime={true} />}
            >
                <Card.Meta
                    title={(
                        <Space direction="horizontal">
                            {showIndex ? <h1 className="post-index">{String(itemIndex + 1).padStart(2, '0')}</h1> : null}
                            <Space direction="vertical">
                                <Rtb value={body} id={postId} readOnly={true} className="short-post-content" />
                                <Link to={postUrl}> Detail </Link>
                            </Space>
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

ShortPostStyle.propTypes = propTypes;
ShortPostStyle.defaultProps = defaultProps;

export default ShortPostStyle;

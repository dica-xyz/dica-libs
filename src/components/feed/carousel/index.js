import React from 'react';
import PropTypes from 'prop-types';
import {
    Carousel, Card
} from 'antd';
import TimeLabel from '../../timeLabel';
import UserLink from '../../userLink';
import Link from '../../link';
import { url } from '../../../utils';
import FeatureImage from '../../featureImage';
import PostTitle from '../../postTitle';
import PostSummary from '../postSummary';
import './styles.less';
import '../styles.less';

const propTypes = {
    feedId: PropTypes.string,
    imageContainerHeight: PropTypes.string,
    imageContainerWidth: PropTypes.string,
    imageHeight: PropTypes.string,
    imageWidth: PropTypes.string,
    posts: PropTypes.array,
    title: PropTypes.string,
    showHeader: PropTypes.bool,
    titleUrl: PropTypes.string
};

const defaultProps = {
    showHeader: true
};

const FeedCarousel = (props) => {
    const {
        imageContainerHeight, imageContainerWidth, feedId, showHeader,
        imageHeight, imageWidth, posts, title: feedTitle, titleUrl,
    } = props;

    return posts && posts.length
        ? (
            <div className="feed-carousel">
                {
                    feedTitle
                        ? (
                            <div className="dica-list-header">
                                {
                                    showHeader && titleUrl && titleUrl.length > 0
                                        ? (
                                            <Link
                                                to={titleUrl.replace(':feedId', feedId)
                                                    .replace(':title', url.urlEncode(feedTitle))}>
                                                <h2>{feedTitle}</h2>
                                            </Link>
                                        )
                                        : <h2>{feedTitle}</h2>
                                }
                            </div>
                        )
                        : null
                }
                <Carousel
                    autoplay={true}
                >
                    {
                        posts && posts.length > 0 && posts.map((post) => {
                            const {
                                postId, title, timestamp, featureImage,
                                author, summary
                            } = post;
                            const postUrl = `/post/${postId}/${title && url.urlEncode(title)}`;

                            return (
                                <Card
                                    key={postId}
                                    bordered={false}
                                    cover={
                                        (
                                            <>
                                                <TimeLabel timestamp={timestamp} relativeTime={true} />
                                                <FeatureImage
                                                    url={postUrl} imageSrc={featureImage}
                                                    {...{
                                                        imageContainerHeight,
                                                        imageContainerWidth,
                                                        imageHeight,
                                                        imageWidth,
                                                    }}
                                                />
                                            </>
                                        )
                                    }
                                >
                                    <Card.Meta
                                        title={<PostTitle post={post} />}
                                        description={
                                            (
                                                <>
                                                    <PostSummary summary={summary} />
                                                    <UserLink
                                                        address={author.address}
                                                        username={author.username}
                                                        profile={author.profile}
                                                        avatarSize={32}
                                                    />
                                                </>
                                            )
                                        }
                                    />
                                </Card>
                            );
                        })
                    }
                </Carousel>
            </div>
        ) : null;
};

FeedCarousel.propTypes = propTypes;

FeedCarousel.defaultProps = defaultProps;

export default FeedCarousel;

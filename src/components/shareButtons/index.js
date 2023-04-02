import React from 'react';
import PropTypes from 'prop-types';
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    RedditShareButton,
    TelegramShareButton,
    TwitterShareButton,
    WeiboShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    TelegramIcon,
    RedditIcon,
    EmailIcon,
    WeiboIcon,
} from "react-share";
import './styles.less';

const propTypes = {
    title: PropTypes.string,
    summary: PropTypes.string,
    url: PropTypes.string,
};
const defaultProps = {};
const ShareButtons = (props) => {
    const {
        url, title, summary,
    } = props;
    return (
        <>
            <FacebookShareButton title={title} url={url}>
                <FacebookIcon size={32} round />
            </FacebookShareButton>
            <LinkedinShareButton title={title} summary={summary} url={url}>
                <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <RedditShareButton title={title} url={url}>
                <RedditIcon size={32} round />
            </RedditShareButton>
            <TelegramShareButton title={title} url={url}>
                <TelegramIcon size={32} round />
            </TelegramShareButton>
            <TwitterShareButton title={title} url={url}>
                <TwitterIcon size={32} round />
            </TwitterShareButton>
            <WeiboShareButton title={title} url={url}>
                <WeiboIcon size={32} round />
            </WeiboShareButton>
            <EmailShareButton subject={title} url={url}>
                <EmailIcon size={32} round />
            </EmailShareButton>
        </>
    );
};
ShareButtons.propTypes = propTypes;
ShareButtons.defaultProps = defaultProps;
export default ShareButtons;
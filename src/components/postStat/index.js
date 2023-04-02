/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Space } from "antd";
import withApis from '../withApis';
import withComponentWrapper from "../withComponentWrapper";
import FavIcon from './favIcon';
import LikeIcon from './likeIcon';
import DislikeIcon from './dislikeIcon';
import TipIcon from './tipIcon';
import ShareIcon from './shareIcon';
import CommentIcon from './commentIcon';
import './styles.less';

const propTypes = {
    post: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    className: PropTypes.string,
    gap: PropTypes.number,
    apis: PropTypes.object
};

const defaultProps = {
    gap: 12
};

const PostStat = (props) => {
    const {
        post: { status, postId },
        className, user, apis, gap
    } = props;
    const [statInfo, setStatInfo] = useState({
        comment: { count: 0 },
        liked: { checked: false, count: 0 },
        disliked: { checked: false },
        tip: { checked: false, amount: 0 },
        faved: false
    });

    const { postStatApi, execApi } = apis;

    useEffect(() => {

        execApi(
            (options) => postStatApi(options).statInfo({ parentId: postId, address: user?.address }),
            (result) => { setStatInfo(result.data); }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, postId]);



    return (
        <Space
            direction="horizontal"
            size={gap}
            className={`post-stat ${className || ""}`}>
            <CommentIcon  {...props} data={statInfo.comment} />
            <LikeIcon
                {...props}
                data={statInfo.liked}
            />
            <DislikeIcon
                {...props}
                data={statInfo.disliked}
            />
            {status === 4 ?
                (
                    <TipIcon
                        {...props}
                        data={statInfo.tipped}
                    />
                ) : null
            }
            <FavIcon
                {...props}
                checked={statInfo.faved}
            />
            <ShareIcon
                {...props}
            />
        </Space>
    );
};

PostStat.propTypes = propTypes;
PostStat.defaultProps = defaultProps;

export default withComponentWrapper(withApis(PostStat));

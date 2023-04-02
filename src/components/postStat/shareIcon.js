import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ShareAltOutlined } from '@ant-design/icons';
import { useToggle } from 'ahooks';
import { NeedLogin } from '../messageBox';
import PostToFeed from '../postToFeed';

const propTypes = {
    post: PropTypes.object.isRequired,
    user: PropTypes.object
};
const defaultProps = {};
const ShareIcon = (props) => {
    const { post, user } = props;

    const [state, { toggle }] = useToggle();
    const [spin, setSpin] = useState(false);
    const statIt = () => {
        if (!user.isLogin) {
            NeedLogin();
            return;
        }
        toggle()
    };

    return (
        <>
            <ShareAltOutlined
                title="Add to my publication"
                spin={spin}
                onClick={() => statIt()}
                className="post-stat-icon post-stat-icon-share" />
            <PostToFeed
                title="Add to my publication"
                visible={state}
                user={user}
                post={post}
                onClose={(succeeded) => {
                    toggle();
                    if (succeeded) {
                        setSpin(true);
                        setTimeout(() => {
                            setSpin(false);
                        }, 1000);
                    }
                }}
            />
        </>
    );
};
ShareIcon.propTypes = propTypes;
ShareIcon.defaultProps = defaultProps;
export default ShareIcon;
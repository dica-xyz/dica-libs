import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SoundOutlined, BellOutlined } from '@ant-design/icons';
import { Popover, Input } from 'antd';
import withApis from '../withApis';
import { MessageBox, NeedLogin } from '../messageBox';

const { Search } = Input;
const propTypes = {
    size: PropTypes.number,
    author: PropTypes.string,
    user: PropTypes.object,
    apis: PropTypes.object
};
const defaultProps = {
    size: 16
};
const Notification = (props) => {
    const {
        size, author, user, apis
    } = props;
    const [subscribed, setSubscribed] = useState(false);
    const [hasEmail, setHasEmail] = useState();
    const [showPopover, setShowPopover] = useState(false);
    const { accountApi, execApi } = apis;

    useEffect(() => {
        const hasSubscribed = async () => {
            execApi(
                (options) => accountApi(options).hasSubscribed({ address: user.address, author }),
                (result) => {
                    setSubscribed(result.data.subscribed);
                    setHasEmail(result.data.hasEmail);
                }
            );
        };
        if (user.isLogin && author) { hasSubscribed(); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNotification = async () => {
        if (!user.isLogin) {
            NeedLogin();
            setShowPopover(false);
            return;
        }
        setShowPopover(!showPopover);

        // if subscribed, do nothing
        if (!subscribed) {
            if (hasEmail) {
                execApi(
                    (options) => accountApi(options).subscribeAuthor(user.address, author),
                    () => MessageBox({ title: `Subscribe ${author} succeeded` })
                );
            }
        }
    };

    const handleSubscribe = async (email) => {
        execApi(
            (options) => accountApi(options).subscribeAuthor({
                secret: user.secret,
                email,
                address: user.address,
                author,
            }),
            () => {
                setSubscribed(true);
                MessageBox({ title: `Subscribe ${author} succeeded` });
            }
        );
    };

    const handleUnsubscribe = async () => {
        execApi(
            (options) => accountApi(options).unSubscribeAuthor({
                secret: user.secret,
                address: user.address,
                author
            }),
            () => {
                setSubscribed(false);
                setShowPopover(false);
                MessageBox({ title: `Unsubscribe ${author} succeeded` });
            }
        );
    };

    const content = (
        <Search
            type="email"
            placeholder="Your email address"
            name="email"
            onSearch={(value) => handleSubscribe(value)}
            enterButton="Subscribe"
            style={{ width: '300px' }} />
    );

    return user.address === author ? null
        : !subscribed && !hasEmail
            ? (
                <Popover
                    open={showPopover}
                    content={content}
                    trigger="click">
                    <a
                        style={{ lineHeight: `${size}px` }}
                        role="button" tabIndex="-1"
                        className="btn-notification hidden-xs"
                        title="Subscribe and get notifications"
                        onClick={handleNotification}>
                        <BellOutlined />
                    </a>
                </Popover>
            )
            : !subscribed && hasEmail
                ? (
                    <a
                        style={{ lineHeight: `${size}px` }}
                        role="button" tabIndex="-1"
                        className="btn-notification hidden-xs"
                        title="Subscribe and get notifications"
                        onClick={() => handleSubscribe()}>
                        <BellOutlined />
                    </a>
                )
                : (
                    <a
                        style={{ lineHeight: `${size}px` }}
                        role="button" tabIndex="-1"
                        className="btn-notification hidden-xs"
                        title="Unsubscribe"
                        onClick={() => handleUnsubscribe()}>
                        <SoundOutlined />
                    </a>
                );
};
Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;
export default withApis(Notification);
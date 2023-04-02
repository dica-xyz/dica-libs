/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { UserOutlined, LogoutOutlined, LayoutOutlined, LockOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import UserLink from '../userLink';

import Login from '../login';
import './style.less';

const propTypes = {
    user: PropTypes.object,
    userLogout: PropTypes.func
};

const defaultProps = {};

const UserLogin = (props) => {
    const [showLogin, setShowLogin] = useState(false);
    const { user, userLogout } = props;
    const {
        isLogin, address, avatar, username, description
    } = user;

    const loginClick = (e) => {
        e.preventDefault();
        setShowLogin(true);
    };

    const logOut = () => {
        Cookies.remove('userAddress');
        userLogout();
        setShowLogin(false);
    };

    const items = [
        {
            label: <a href={`/profile/${address}`}>Profile</a>,
            key: 'Profile',
            icon: <UserOutlined />
        },
        {
            label: <a href={`/@${username ?? address}`}>Publication</a>,
            key: 'Publication',
            icon: <LayoutOutlined />
        },
        {
            label: <a href={`${global.CMS_SERVER || ''}/admin`} type="default" size="small"
                target="_blank"
                className="btn-admin-login">Admin</a>,
            key: 'admin',
            icon: <LockOutlined />
        },
        {
            label: <a onClick={logOut} role="button" tabIndex="-1">Log Out</a>,
            key: 'logout',
            icon: <LogoutOutlined />
        }
    ];

    return isLogin
        ? (
            <Dropdown menu={{ items }}>
                <span className="user-login-container">
                    <UserLink
                        address={address}
                        username={username}
                        avatar={avatar}
                        title={description}
                        avatarSize={32}
                    />
                </span>
            </Dropdown>
        )
        : (
            <>
                <a
                    className="user-sign-in"
                    onClick={loginClick}
                    role="presentation">
                    <UserOutlined />
                    Sign In
                </a>
                <Login
                    {...props}
                    visible={showLogin}
                    onClose={() => setShowLogin(false)} />
            </>
        );
};

UserLogin.propTypes = propTypes;

UserLogin.defaultProps = defaultProps;

export default UserLogin;

import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from '../link';
import crypto from '../../utils/blockchain/crypto';
import Follow from './follow';
import Notification from './notification';
import { GlobalContext } from '../../context';
import { ADD_ACCOUNT } from '../../context/actions/accountsActions';
import { addressRegex } from '../../utils/validations';
import withApis from '../withApis';
import Svg from '../svg';
import './styles.less';

const propTypes = {
    userData: PropTypes.object,
    apis: PropTypes.object,
    address: PropTypes.string,
    username: PropTypes.string,
    profile: PropTypes.string,
    showFollow: PropTypes.bool,
    showAvatar: PropTypes.bool,
    showNotification: PropTypes.bool,
    icon: PropTypes.object,
    avatar: PropTypes.string,
    publicKey: PropTypes.string,
    avatarSize: PropTypes.number,
    title: PropTypes.string,
    user: PropTypes.object,
    intl: PropTypes.object,
    size: PropTypes.oneOf(['small', 'middle', 'large'])
};

const defaultProps = {
    size: 'small',
    showNotification: false,
    showFollow: false,
    avatarSize: 24,
    showAvatar: true,
    icon: <UserOutlined />,
};

const UserLink = (props) => {
    const { accounts, accountsDispatch } = useContext(GlobalContext);
    const {
        userData, address: pAddress, username: pUsername,
        title, user, intl, apis, size, avatarSize,
        avatar: pAvatar, publicKey, profile,
        showAvatar, icon, showFollow, showNotification
    } = props;
    const { accountApi, options } = apis;

    const [address, setAddress] = useState(pAddress);

    const [username, setUsername] = useState();

    const [avatar, setAvatar] = useState(pAvatar);

    useEffect(() => {
        const getUser = async (_address) => {
            let _user = { address: _address };
            setAddress(_user.address);
            setUsername(pUsername || (userData?.username));

            if (addressRegex.test(_address)) {
                const _account = await accountApi(options).getAccount(_address);

                if (!_account) return;
                _user = { ..._user, ..._account };
                accountsDispatch({ type: ADD_ACCOUNT, params: _user });
                setUsername(_user?.username);
                setAvatar(_user?.avatar);
            }
        };
        const _address = pAddress
            || (userData?.address)
            || (publicKey && crypto.getAddress(publicKey))
            || (userData?.publicKey && crypto.getAddress(userData.publicKey));

        setAddress(_address);
        const _user = accounts[_address];
        if (_user) {
            setUsername(_user?.username);
            setAvatar(_user?.avatar);
        } else {
            getUser(_address);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile, pUsername, userData, pAddress, publicKey]);

    return !username && !address
        ? null : (
            <Space
                size={size}
                className="user-link"
                style={{ lineHeight: `${avatarSize}px` }}>
                <Link
                    className={size === 'small' ? "link-small" : "link"}
                    to={`/profile/${address}`}
                    title={title || address}>
                    <Space size={size} direction="horizontal">
                        {
                            showAvatar
                                ? avatar
                                    ? avatar.startsWith('<svg')
                                        ? (
                                            <Svg
                                                src={avatar}
                                                width={avatarSize}
                                                height={avatarSize}
                                                style={{ display: "inline-block" }} />
                                        )
                                        : (
                                            <Avatar
                                                src={avatar}
                                                size={avatarSize} />
                                        )
                                    : (
                                        <Avatar
                                            icon={icon}
                                            size={avatarSize}
                                        />
                                    )
                                : null
                        }

                        <span className="username" style={{ lineHeight: `${avatarSize}px` }}>
                            {username || address}
                        </span>
                    </Space>
                </Link>
                {
                    showFollow
                        ? <Follow size={size} author={address} user={user} intl={intl} />
                        : null
                }
                {
                    showNotification
                        ? <Notification size={avatarSize} author={address} user={user} />
                        : null
                }
            </Space>

        )

};

UserLink.propTypes = propTypes;
UserLink.defaultProps = defaultProps;
export default withApis(UserLink);

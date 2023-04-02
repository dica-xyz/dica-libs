/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import PropTypes from 'prop-types';
import {
    SearchOutlined, LockOutlined
} from '@ant-design/icons';
import {
    Space, theme
} from 'antd';
import UserLogin from '../userLogin';
import Link from '../link';
import PostNewButton from '../postNewButton';
import ThemePicker from '../themePicker';
import withComponentWrapper from '../withComponentWrapper';
import './styles.less';
import Logo from '../logo';
import clsx from 'clsx';

const propTypes = {
    user: PropTypes.object,
    site: PropTypes.object,
    changeTheme: PropTypes.func
};

const defaultProps = {};

const Header = (props) => {
    const { site, user, className, changeTheme } = props;
    const { useToken } = theme;
    const { token } = useToken();

    return (
        <Space direction="horizontal" className={clsx("dica-header", className)}>
            {
                site.schema.settings.logo
                    ? <Logo
                        imgSrc={site.schema.settings.logo}
                        title={site.schema.settings.title}
                    />
                    : null
            }
            <PostNewButton className="new-post-button" />
            <Link to="/post/search/" className="search" style={{ color: token.colorPrimary }}>
                <SearchOutlined />
            </Link>
            <Space split="|">
                <UserLogin {...props} className="user-login" />
                {
                    !user.isLogin
                        ? (
                            <a
                                href={`${global.CMS_SERVER || ''}/admin`} type="default" size="small"
                                target="_blank"
                                className="btn-admin-login">
                                <LockOutlined />
                                Admin
                            </a>
                        ) : null
                }
                <ThemePicker changeTheme={changeTheme} site={site} />
            </Space>
        </Space>
    );
};

Header.displayName = 'header';
Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default withComponentWrapper(Header);

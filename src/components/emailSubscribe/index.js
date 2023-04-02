import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { NeedLogin, MessageBox } from '../messageBox';
import withApis from "../withApis";
import './styles.less';

const { Search } = Input;

const propTypes = {
    user: PropTypes.object,
    apis: PropTypes.object,
};
const defaultProps = {};
const EmailSubscribe = (props) => {
    const { user, apis } = props;
    const { accountApi, execApi } = apis;

    const handleSubscribe = async (email) => {
        if (!user.isLogin) {
            NeedLogin();
            return;
        }
        execApi(
            (options) => accountApi(options).subscribe({ address: user.address, email }),
            () => MessageBox({
                title: 'Thanks for subscribing',
                body: `If you have registered, your login email is changed to ${email} as well.`,
                type: 'success',
            })
        );
    };
    return (
        <div className="email-subscribe">
            <Search
                type="email"
                placeholder="Your email address"
                name="email"
                onSearch={(value) => handleSubscribe(value)}
                enterButton="Subscribe"
                style={{ width: '300px' }} />
        </div>
    );
};
EmailSubscribe.propTypes = propTypes;
EmailSubscribe.defaultProps = defaultProps;
export default withApis(EmailSubscribe);

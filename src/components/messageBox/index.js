import React from 'react';
import { notification } from 'antd';
import { isServer } from '../../utils/environment';

const MessageBox = ({ title, body, type = 'success' }) => {
    if (isServer) { return; }
    if (type && ['success', 'info', 'warning', 'error'].indexOf(type) > -1) {
        notification[type]({
            duration: 5,
            message: title || '',
            description: body || '',
        });
    } else {
        notification.error({
            message: 'Message type invalid',
            description: 'Only success, info, warning and error are valid',
        });
    }
};

const MessageErrorBox = (err) => {
    if (isServer || !err) { return; }
    if (Array.isArray(err)) {
        const messages = err.map(
            (_err) => {
                if (typeof _err === 'object' && _err.message) {
                    return (
                        <li key={_err.message}>
                            {_err.message}
                        </li>
                    );
                }
                if (typeof _err === 'string') {
                    return (
                        <li key={_err}>
                            {_err}
                        </li>
                    );
                }
                return null;
            },
        );

        notification.error({
            duration: 5,
            message: <ul>{messages}</ul>,
        });
    } else {
        notification.error({
            duration: 5,
            message: err
        });
    }
};

const NeedLogin = () => {
    MessageBox({
        title: 'Who are you?',
        body: 'Sign in, please.',
        type: 'error',
    });
};

export { MessageBox, MessageErrorBox, NeedLogin };
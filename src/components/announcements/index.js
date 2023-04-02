import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';

const propTypes = {
    messages: PropTypes.array,
    schema: PropTypes.object,
};
const defaultProps = {
};
const Announcements = (props) => {
    const { messages, site: { schema } } = props;
    let _messages = messages || [];
    if (schema.settings.announcements
        && schema.settings.announcements.length > 0) {
        _messages = [..._messages, ...schema.settings.announcements];
    }

    if (!_messages || _messages.length === 0) return null;
    return (
        _messages.map((message) => (
            <Alert
                key={message.id}
                message={`${message.date ? `${message.date}: ` : ''} ${message.message}. `}
                type={message.type}
                closable
                banner
            />
        ))
    );
};
Announcements.propTypes = propTypes;
Announcements.defaultProps = defaultProps;
Announcements.displayName = 'Announcements';
export default Announcements;
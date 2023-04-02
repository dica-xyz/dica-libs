/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-children-prop */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontColorsOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { SketchPicker } from 'react-color';
import {
    toggleCustomInlineStyle,
} from '../../draftjs-utils';

export default (config) => (class FontColorButton extends Component {
    // eslint-disable-next-line react/static-property-placement
    static propTypes = {
        theme: PropTypes.object,
        getEditorState: PropTypes.func,
        setEditorState: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.config = {
            ...(config || {}),
            defaultColor: 'rgba(0, 0, 0, 0)',
        };
        this.state = {
            textColor: this.config.defaultColor,
        };
    }

    toggleStyle = (color) => {
        const newTextColor = color.hex;
        this.setState({ textColor: newTextColor });
        const newEditState = toggleCustomInlineStyle(
            this.props.getEditorState(),
            'color',
            newTextColor,
        );
        this.props.setEditorState(newEditState);
    };

    renderColorPicker = () => (
        <SketchPicker color={this.state.textColor} onChangeComplete={this.toggleStyle} />
    );

    preventBubblingUp = (event) => {
        event.preventDefault();
    };

    render() {
        const { theme } = this.props;
        // const className = this.styleIsActive()
        //     ? clsx(theme.button, theme.active)
        //     : theme.button;
        const className = theme.button;
        return (
            <div
                className={theme.buttonWrapper}
                onMouseDown={this.preventBubblingUp}
                role="button" tabIndex="-1"
            >
                <Popover content={this.renderColorPicker()}>
                    <button
                        className={className}
                        onClick={this.toggleStyle}
                        type="button"
                    >
                        <FontColorsOutlined style={{ position: 'relative', fontSize: '23px' }} />
                    </button>
                </Popover>
            </div>
        );
    }
});

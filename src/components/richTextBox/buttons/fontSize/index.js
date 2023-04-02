/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable react/static-property-placement */
/* eslint-disable react/no-children-prop */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    getSelectionCustomInlineStyle, toggleCustomInlineStyle,
} from '../../draftjs-utils';

const CreateFontSizeButton = (config) => class FontSizeButton extends Component {
    static propTypes = {
        theme: PropTypes.object,
        getEditorState: PropTypes.func,
        setEditorState: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.config = {
            ...config,
            defaultFontSize: 20,
            minFontSize: 16,
            maxFontSize: 30,
        };

        this.state = {
            currentFontSize: this.config.defaultFontSize,
        };
    }

    // eslint-disable-next-line class-methods-use-this
    preventBubblingUp(evt) {
        evt.preventDefault();
    }

    toggleStyle(evt) {
        this.preventBubblingUp(evt);
        const fontSize = this.getCurrentFontSize() + 1 * (this.config.sizeUp ? 1 : -1);
        this.applyFontSizeInlineStyle(fontSize);
    }

    applyFontSizeInlineStyle(fontSize) {
        const editorState = this.props.getEditorState();
        const newEditState = toggleCustomInlineStyle(
            editorState,
            'fontSize',
            fontSize,
        );
        this.props.setEditorState(newEditState);
    }

    getCurrentFontSize = () => {
        const currentFontSize = getSelectionCustomInlineStyle(this.props.getEditorState(), ['FONTSIZE']).FONTSIZE;
        let fontSize;
        if (currentFontSize) {
            fontSize = Number(currentFontSize.substr(9, 2));
        } else {
            fontSize = 20;
        }
        this.setState({ currentFontSize: fontSize });
        return fontSize;
    };

    render() {
        const { theme } = this.props;
        const { minFontSize, maxFontSize } = this.config;
        // const className = this.styleIsActive()
        //     ? clsx(theme.button, theme.active)
        //     : theme.button;
        const { currentFontSize } = this.state;
        let disabled;
        if (config.sizeUp) {
            disabled = currentFontSize > maxFontSize;
        } else {
            disabled = currentFontSize < minFontSize;
        }
        const className = theme.button;
        return (
            <div
                className={theme.buttonWrapper}
                onMouseDown={this.preventBubblingUp}
                role="button" tabIndex="-1"
            >
                <button
                    disabled={disabled}
                    className={className}
                    onClick={this.toggleStyle}
                    type="button"
                >
                    <span style={{ position: 'relative', top: '-3px' }}>
                        {' '}
                        {config.children}
                    </span>
                </button>
            </div>
        );
    }
};
export default CreateFontSizeButton;

export const FontSizeUpButton = CreateFontSizeButton({
    sizeUp: true, children: (<svg width="30" height="30" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#888" d="M957.6 541.6H831.7v126.3h-63.2V541.6H642v-63.7h126.5V351h63.2v126.9h125.9v63.7zM581.5 766.3h-82L440.8 609H201.4l-55.3 157.4h-82l219-574.9h79.4l219 574.8zM417.8 544L331 305c-2.7-7.7-5.7-21-8.9-40.1h-1.9c-2.7 17.3-5.8 30.7-9.3 40.1l-86.1 239h193z" /></svg>),
});

export const FontSizeDownButton = CreateFontSizeButton({
    sizeDown: true, children: (<svg width="30" height="30" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#888" d="M581.5 766.3h-82L440.8 609H201.4l-55.3 157.4h-82l219-574.9h79.4l219 574.8zM417.8 544L331 305c-2.7-7.7-5.7-21-8.9-40.1h-1.9c-2.7 17.3-5.8 30.7-9.3 40.1l-86.1 239h193zM642 477.9h315.6v63.7H642z" /></svg>),
});

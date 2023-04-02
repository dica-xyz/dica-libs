/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import { Typography } from 'antd';
import './styles/index.less';

/* editor plugins */
import {
    HeadlineOneButton,
    HeadlineTwoButton,
    BlockquoteButton,
    CodeBlockButton,
    UnorderedListButton,
    OrderedListButton,
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton
} from '@draft-js-plugins/buttons';

// import createEmojiPlugin from 'draft-js-emoji-plugin';
// import 'draft-js-emoji-plugin/lib/plugin.css';
// const emojiPlugin = createEmojiPlugin();
// const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

import createVideoPlugin from '@draft-js-plugins/video';
// import createCodeEditorPlugin from './plugins/code';
// import Prism from 'prismjs';
// import createPrismPlugin from 'draft-js-prism-plugin';

import createSideToolbarPlugin from '@draft-js-plugins/side-toolbar';
import createInlineToolbarPlugin, { Separator } from '@draft-js-plugins/inline-toolbar';
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createFocusPlugin from '@draft-js-plugins/focus';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createImagePlugin from '@draft-js-plugins/image';
import createHashtagPlugin, { extractHashtagsWithIndices } from '@draft-js-plugins/hashtag';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import createLinkPlugin from '@draft-js-plugins/anchor';
import createDividerPlugin from '@draft-js-plugins/divider';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import { getCustomStyleMap, extractInlineStyle } from './draftjs-utils';
import ImageComponent from './components/image';
import { FontSizeUpButton, FontSizeDownButton } from './buttons/fontSize';
import FontStrikeThroughButton from './buttons/fontStrikeThrough';
import CreateFontColorButton from './buttons/fontColor';
// import CreateCodeLanguageButton from './buttons/codeLanguageButton';
import styleMap from './styleMap';
import ImagePickerButton from './buttons/imagePickerButton';
import AddVideoButton from './buttons/addVideoButton';
import Video from './components/video';
import HashTagComponent from './components/hashTag';

// const codeEditorPlugin = createCodeEditorPlugin();
// const prismPlugin = createPrismPlugin({
//     prism: Prism
// });
const FontColorButton = CreateFontColorButton();
// const CodeLanguageSelector = CreateCodeLanguageButton();
const sideToolbarPlugin = createSideToolbarPlugin();
const { SideToolbar } = sideToolbarPlugin;
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin({
    horizontal: 'relative', vertical: 'auto',
});
const blockDndPlugin = createBlockDndPlugin();

const decorator = composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
);
const videoPlugin = createVideoPlugin({
    decorator,
    videoComponent: Video
});
const imagePlugin = createImagePlugin({
    decorator,
    imageComponent: ImageComponent
});

const hashtagPlugin = createHashtagPlugin({
    hashtagComponent: HashTagComponent
});
const linkifyPlugin = createLinkifyPlugin();
const linkPlugin = createLinkPlugin({
    theme: {
        input: 'anchor-plugin-input',
        link: ''
    },
    placeholder: 'http://…',
    linkTarget: '_blank',
});

const dividerPlugin = createDividerPlugin();
const { DividerButton } = dividerPlugin;

const plugins = [
    linkPlugin, inlineToolbarPlugin, linkifyPlugin,
    focusPlugin, alignmentPlugin, resizeablePlugin,
    imagePlugin, sideToolbarPlugin, hashtagPlugin,
    dividerPlugin, blockDndPlugin, videoPlugin,
    // codeEditorPlugin, prismPlugin
];
/** editor plugins ends */

const propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string,
    id: PropTypes.string,
    readOnly: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    placeholder: PropTypes.string,
    charMax: PropTypes.number,
    showCharCount: PropTypes.bool,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
};

const defaultProps = {
    showCharCount: false,
    readOnly: false,
    onChange: () => { },
};

const countChars = (_value) => {
    if (!_value?.blocks?.length) {
        return 0;
    }
    const str = _value?.blocks?.reduce((accu, cur) => accu + cur.text, '')
    let point;
    let index;
    let width = 0;
    let len = 0;
    for (index = 0; index < str.length;) {
        point = str.codePointAt(index);
        width = 0;
        while (point) {
            width += 1;
            point = point >> 8;
        }
        index += Math.round(width / 2);
        len += 1;
    }
    return len;
};

const RichTextBox = (props) => {
    const editor = useRef();
    const {
        value, placeholder: pPlaceholder, id, charMax, showCharCount,
        className, readOnly, style, onChange: pOnChange
    } = props;
    const [placeholder, setPlaceholder] = useState(pPlaceholder);
    const [charCount, setCharCount] = useState(0);

    const loadContentFromProp = () => {
        if (value) {
            try {
                const _editorState = EditorState.createWithContent(convertFromRaw(value));
                extractInlineStyle(_editorState);
                return _editorState;
            } catch {
                setPlaceholder('Invalid format. Unable to load content.');
            }
        }

        return null;
    };
    // load content when in SSR
    const [editorState, setEditorState] = useState(loadContentFromProp());

    // when new post's id changes,
    // create empty post
    useEffect(() => {
        if (id) {
            if (!value) {
                setEditorState(EditorState.createEmpty());
            } else {
                setEditorState(loadContentFromProp());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const onChange = (_state) => {
        setEditorState(_state);
        if (_state) {
            const _value = convertToRaw(_state.getCurrentContent());
            const _charCount = countChars(_value);
            setCharCount(_charCount);
            pOnChange(_value);
        } else {
            setCharCount(0);
            pOnChange(null);
        }
    };

    const focus = () => {
        editor.current.focus();
    };

    return !editorState ? null : (
        <Typography.Text
            className={`dica-editor ${className || ''}`}
            style={style}
            onMouseDown={focus}
            role="presentation">
            <Editor
                customStyleMap={{ ...getCustomStyleMap(), ...styleMap }}
                placeholder={placeholder}
                editorState={editorState}
                onChange={onChange}
                readOnly={readOnly}
                plugins={plugins}
                spellCheck={true}
                ref={(element) => { editor.current = element; }}
            />
            {
                readOnly ? null
                    : (
                        <>
                            <SideToolbar>
                                {
                                    (externalProps) => (
                                        <>
                                            <CodeBlockButton {...externalProps} />
                                            <UnorderedListButton {...externalProps} />
                                            <OrderedListButton {...externalProps} />
                                            <BlockquoteButton {...externalProps} />
                                            <ImagePickerButton {...externalProps} />
                                            <AddVideoButton {...externalProps} />
                                            <DividerButton {...externalProps} />
                                        </>
                                    )
                                }
                            </SideToolbar>
                            <InlineToolbar>
                                {
                                    (externalProps) => (
                                        <>
                                            <HeadlineOneButton {...externalProps} />
                                            <HeadlineTwoButton {...externalProps} />
                                            <BoldButton {...externalProps} />
                                            <ItalicButton {...externalProps} />
                                            <UnderlineButton {...externalProps} />
                                            <Separator {...externalProps} />
                                            <FontStrikeThroughButton {...externalProps} />
                                            <linkPlugin.LinkButton {...externalProps} />
                                            <FontColorButton {...externalProps} />
                                            <FontSizeUpButton {...externalProps} />
                                            <FontSizeDownButton {...externalProps} />
                                            <CodeButton {...externalProps} />
                                            {/* <CodeLanguageSelector {...externalProps} /> */}
                                        </>
                                    )
                                }
                            </InlineToolbar>
                            <AlignmentTool />
                        </>
                    )
            }
            <hr />
            {
                showCharCount ? (
                    <span className="dica-rtb-char-count">
                        <span className={charCount > charMax ? 'dica-rtb-char-count-error' : ''}>{charCount}</span>{`${charMax ? ` / ${charMax}` : ''} chars`}
                    </span>
                ) : null
            }
        </Typography.Text>
    );
};

RichTextBox.propTypes = propTypes;
RichTextBox.defaultProps = defaultProps;
RichTextBox.extractHashtagsWithIndices = extractHashtagsWithIndices;
RichTextBox.countChars = countChars;

export default RichTextBox;

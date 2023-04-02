// This code is based on https://github.com/withspectrum/draft-js-code-editor-plugin
import CodeUtils from 'draft-js-code';
import { RichUtils } from 'draft-js';

const createCodeEditorPlugin = () => {
    return {
        handleKeyCommand(command, editorState, eventTimeStamp, { setEditorState }) {
            let newState;

            if (CodeUtils.hasSelectionInBlock(editorState)) {
                newState = CodeUtils.handleKeyCommand(editorState, command);
            } else {
                newState = RichUtils.handleKeyCommand(editorState, command);
            }

            if (newState) {
                setEditorState(newState);
                return 'handled';
            }
            return 'not-handled';
        },
        keyBindingFn(evt, { getEditorState, setEditorState }) {
            const editorState = getEditorState();
            if (evt.code === 'Tab') {
                if (!CodeUtils.hasSelectionInBlock(editorState)) return 'not-handled';
                setEditorState(CodeUtils.onTab(evt, editorState));
                return 'handled';
            }

            if (!CodeUtils.hasSelectionInBlock(editorState)) return;

            return CodeUtils.getKeyBinding(evt);
        },
        handleReturn(evt, editorState, { setEditorState }) {
            if (!CodeUtils.hasSelectionInBlock(editorState)) return 'not-handled';

            setEditorState(CodeUtils.handleReturn(evt, editorState));
            return 'handled';
        }
    }
}

export default createCodeEditorPlugin;
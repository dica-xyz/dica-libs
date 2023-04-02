import * as actions from '../actions/themesActions';
import { setTheme } from '../../utils/theme';

const initState = {
    all: null,
    currentThemeName: null,
    currentTheme: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case actions.CHANGE_THEME: {
            const { themeName } = action;
            const currentTheme = setTheme(state.all, themeName);
            const _state = {
                ...state,
                currentThemeName: themeName,
                currentTheme
            };

            return _state;
        }
        default:
            return state;
    }
};

export default { initState, reducer };

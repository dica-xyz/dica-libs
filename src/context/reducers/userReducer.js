import { blockchain } from '../../utils';
import * as actions from '../actions/userActions';

const { generateAddress } = blockchain.crypto;
const initState = {
    secret: null,
    address: null,
    keypair: null,
    isLogin: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case actions.USER_LOGIN: {
            const { secret } = action.params;
            let keypair = null;
            if (secret) {
                keypair = generateAddress(secret).keypair;
            }
            const _state = {
                ...state,
                ...action.params,
                keypair: keypair || state.keypair,
                isLogin: !!secret,
            };
            if (global) {
                global.sessionStorage.setItem('user', JSON.stringify(_state));
            }
            return _state;
        }
        case actions.USER_LOGOUT: {
            if (global) {
                global.sessionStorage.removeItem('user');
            }
            return initState;
        }
        default:
            return state;
    }
};

export default { initState, reducer };

import * as actions from '../actions/accountsActions';

const initState = [];

const reducer = (state, action) => {
    switch (action.type) {
        case actions.ADD_ACCOUNT: {
            const { address } = action.params;

            return {
                ...state,
                [address]: action.params
            };
        }
        case actions.ADD_ACCOUNTS: {
            return {
                ...state,
                ...action.params.map((account) => ({ [account.address]: account }))
            };
        }
        default:
            return state;
    }
};

export default { initState, reducer };

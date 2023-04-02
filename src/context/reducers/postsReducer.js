import * as actions from '../actions/postActions';

const initState = {
    postContents: [],
};

const addToPostStore = (post, postContents) => [
    ...postContents.filter((p) => p.postId !== post.postId),
    { ...post, expiredTime: Date.now() + 10 * 60 * 1000 }
];

const reducer = (state, action) => {
    switch (action.type) {
        case actions.ADD_POST:
            {
                const { post } = action;
                // remove expired posts
                let postContents = state.postContents
                    .filter((_post) => _post.expiredTime > Date.now());
                if (Array.isArray(post)) {
                    post.forEach((p) => {
                        postContents = addToPostStore(p, postContents);
                    });
                } else {
                    postContents = addToPostStore(post, postContents);
                }

                return { ...state, postContents };
            }
        case actions.DEL_POST: {
            const { postId } = action;
            const postContents = state.postContents.filter((p) => p.postId !== postId);
            return {
                ...state, postContents: postContents || []
            };
        }
        case actions.CLEAR_POST:
            return { ...state, postContents: [] };
        default:
            return state;
    }
};

export default { initState, reducer };

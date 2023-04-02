export const ADD_POST = "ADD_POST";
export const DEL_POST = "DEL_POST";
export const CLEAR_POST = "CLEAR_POST";

export const savePostToStore = (post) => ({ type: ADD_POST, post });
export const deletePostFromStore = (postId) => ({ type: DEL_POST, postId });
export const clearPosts = () => ({ type: CLEAR_POST });

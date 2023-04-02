import { environment } from '../../utils';

const reducer = (state) => state;

const initState = !environment.isServer ? (window?.__PRELOADED_STATE__?.ssrProps ?? {}) : {};

export default { initState, reducer };

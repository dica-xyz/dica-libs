import { createBrowserHistory, createMemoryHistory } from 'history';
import { environment } from '../utils';

const _history = environment.isServer
    ? createMemoryHistory()
    : createBrowserHistory();
export default _history;
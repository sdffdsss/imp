import { MainAppAction } from '../actions/mainapp-actions/action-types';
import { handleAction } from 'redux-actions';

const defaultState = {};

export default handleAction(
    MainAppAction,
    (state, action) => {
        return action.payload;
    },
    defaultState
);

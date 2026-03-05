import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import mainAppReducer from './mainAppReducer';

const createRootReducer = (history) =>
    combineReducers({
        router: connectRouter(history),
        // rest of other reducers
        mainAppReducer,
    });

export default createRootReducer;

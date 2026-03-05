import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import createRootReducer from '../redux/reducers';
import rootSaga from '../redux/sagas';
// 需要全局共享 history
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

const sagaMiddleware = createSagaMiddleware();
const rootReducer = createRootReducer(history);

// preloadedState 可传入其他中间件
const configureStore = (preloadedState) => {
    // 中间件
    const middlewares = [routerMiddleware(history), sagaMiddleware, thunk, logger];

    const middlewareEnhancer = applyMiddleware(...middlewares);
    const enhancers = [middlewareEnhancer];
    // 从window对象中获取redux谷歌浏览器插件对象如果存在就使用
    const composedEnhancers = composeWithDevTools(...enhancers);

    const store = createStore(rootReducer, preloadedState, composedEnhancers);
    // 运行saga
    store.runSaga = sagaMiddleware.run;
    rootSaga.forEach((saga) => {
        store.runSaga(saga);
    });

    return store;
};

export default configureStore;

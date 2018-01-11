//holds state and sends it to different components of the app. It also compares different objects regardless of reference value in order to assign state correctly.
import {createStore, applyMiddleware} from 'redux';
import reducer from './ducks/users';
import promiseMiddleware from 'redux-promise-middleware';


export default createStore(reducer, applyMiddleware(promiseMiddleware()));
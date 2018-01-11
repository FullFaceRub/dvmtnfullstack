import axios from 'axios';

const initialState = {
    user: {}
}

//Declare variables to prevent typos
const GET_USER_INFO = 'GET_USER_INFO'

//Actions
export function getUserInfo() {

    let userData = axios.get('/auth/me').then(res => {
        return res.data;
    })

    return {
        type: GET_USER_INFO,
        payload: userData
    }
}

export default function reducer(state = initialState, action) { //takes in action from the app and state from the store when invoked and outputs a new piece of state
    switch(action.type){
        case GET_USER_INFO + '_FULFILLED':
            return Object.assign({},state, {user: action.payload})//new object that state gets merged into and then action.payload gets merged into
        default:
        return state //is state === state
    }

}
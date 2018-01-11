import React, { Component } from 'react';
import {connect} from 'react-redux';
import {getUserInfo} from '../../ducks/users';
import './Private.css';

class Private extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() { //action that pulls info from the store
        this.props.getUserInfo() //after connecting this function through the connect invocation, it becomes part of the props object
    }


    bankBalance() {
        return '$' + Math.floor((Math.random() + 1) * 1000) + '.00';
    }

    render() {
        const user = this.props.user;
        return (
            <div className='container'>
                <h1>Community Bank</h1><hr />
                <h4>Account information:</h4>
                {user ? <img className='avatar' src={user.img} alt="You" /> : null}
                <p>Username: {user ? user.username : null}</p>
                <p>Email: {user ? user.email : null}</p>
                <p>ID: {user ? user.auth_id : null}</p>
                <h4>Available balance: {user ? this.bankBalance() : null} </h4>
                <a href='http://localhost:4000/auth/logout'><button>Log out</button></a>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, {getUserInfo})(Private) //connect connects the store to this component, whatever pieces of state or action builders that we need from the store/reducer need to be passed in to this invocation of connect
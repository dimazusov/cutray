import React, { Component } from "react";
import userApi from '../cutrayApi/UserApi';
import {connect} from "react-redux";
import { Redirect } from 'react-router-dom';

class Logout extends Component {
    constructor(props) {
        super(props);

        let params = {token: this.props.token};

        userApi.logout(params,() => {
            this.props.clearUserData();
        });
    }

    render () {
        return <Redirect to={'/'} />;
    }
}

export default connect(
    state =>  ({
        token: state.profile.token
    }),
    dispatch => ({
        clearUserData: (userData) => {
            dispatch({ type: 'CLEAR_PROFILE_USER_DATA', data: {}});
        }
    })
)(Logout);
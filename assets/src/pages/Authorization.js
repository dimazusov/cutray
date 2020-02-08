import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import UserApi from "../cutrayApi/UserApi";
import {connect} from "react-redux";

class Authorization extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errors: [],
            isRedirectToProfile: false
        };

        this.auth = this.auth.bind(this);
        this.addErrors = this.addErrors.bind(this);
        this.clearErrors = this.clearErrors.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    clearErrors() {
        this.setState({ ...this.state, errors: [] });
    }

    addErrors(errors) {
        this.setState({
            ...this.state,
            errors: this.state.errors.concat(errors)
        });
    }

    onChange(event) {
        let newData = {errors: []};

        newData[event.target.name] = event.target.value;

        this.setState(Object.assign(this.state, newData));
    }

    auth(event) {
        event.preventDefault();
        this.clearErrors();

        let callback = (response) => {
            let messages = response.data.messages;

            if (messages) {
                let errors = Object.keys(messages).reduce((arr, item) => {
                    return arr.concat(messages[item]);
                }, []);

                this.addErrors(errors);

                return ;
            }

            this.props.updateUserData({
                user_id: response.data.user_id,
                userRoles: response.data.roles,
                token: response.data.token,
            });

            this.setState({ ...this.state, isRedirectToProfile: true });
        };

        let {email, password} = this.state;

        UserApi.auth({email: email, password: password}, callback);
    }

    render () {
        if (this.state.isRedirectToProfile) {
            return <Redirect to="/profile" />;
        }

        return (
            <div className="wrapper wrapper__padding-footer wrapper__border-top">
                <div className="wrapper_min">
                    <h1 className="page-header">Aвторизация</h1>
                    {this.state.errors.map((item, key) => {
                        return (
                            <div className={'auth__error'} key={key}>{item}</div>
                        );
                    })}
                    <form>
                        <div className="auth__login">
                            <input
                                className="input-area"
                                placeholder="Введите email"
                                type="email"
                                onChange={this.onChange}
                                name={'email'}
                                value={this.state.email}
                            />
                        </div>
                        <div className="auth__password">
                            <input
                                className="input-area"
                                placeholder="Введите пароль"
                                type="password"
                                onChange={this.onChange}
                                name={'password'}
                                value={this.state.password}
                            />
                        </div>
                        <div className="auth__submit">
                            <input className="button" onClick={this.auth} type="submit" value="Войти" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(
    state =>  ({}),
    dispatch => ({
        updateUserData: (userData) => {
            dispatch({ type: 'UPDATE_PROFILE_USER_DATA', data: userData});
        }
    })
)(Authorization);
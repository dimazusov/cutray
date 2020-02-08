import React, { Component } from "react";
import Window from "../containers/Window";
import { Redirect } from 'react-router-dom';
import UserApi from "../cutrayApi/UserApi";
import {connect} from "react-redux";

class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            name: '',
            password: '',
            repeat_password: '',
            errors: [],
            isRedirectToProfile: false
        };

        this.registration = this.registration.bind(this);
        this.addErrors = this.addErrors.bind(this);
        this.clearErrors = this.clearErrors.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    addErrors(errors) {
        this.setState({
            ...this.state,
            errors: this.state.errors.concat(errors)
        });
    }

    clearErrors() {
        this.setState({ ...this.state, errors: [] });
    }

    onChange(event) {
        let newData = {errors: []};

        newData[event.target.name] = event.target.value;

        this.setState(Object.assign(this.state, newData));
    }

    registration(event) {
        event.preventDefault();
        this.clearErrors();

        if (this.state.password != this.state.repeat_password) {
            this.addErrors(['Пароли не совпадают']);

            return ;
        }

        let callback = (response) => {
            let messages = response.data.messages;

            if (messages) {
                let errors = Object.keys(messages).reduce((arr, item) => {
                    return arr.concat(messages[item]);
                }, []);

                this.addErrors(errors);

                return ;
            }

            Window.fire('', 'Вы успешно зарегистрировались', 'success');

            this.props.updateUserData({
                user_id: response.data.user_id,
                userRoles: response.data.roles,
                token: response.data.token,
            });

            setTimeout(() => {
                this.setState({ ...this.state, isRedirectToProfile: true});
            }, 2000);
        };

        let params = {
            email: this.state.email,
            name: this.state.name,
            password: this.state.password
        };

        UserApi.register(params, callback);
    }

    render () {
        if (this.state.isRedirectToProfile) {
            return <Redirect to="/profile" />;
        }

        return (
            <div className="wrapper wrapper__padding-footer wrapper__border-top">
                <div className="wrapper_min">
                    <h1 className="page-header">Регистрация</h1>
                    {this.state.errors.map((item, key) => {
                        return (
                            <div className={'registration__error'} key={key}>{item}</div>
                        );
                    })}
                    <form>
                        <div className="registration__input">
                            <input
                                className="input-area"
                                placeholder="Введите email"
                                type="email"
                                onChange={this.onChange}
                                name={'email'}
                                value={this.state.email}
                            />
                        </div>
                        <div className="registration__input">
                            <input
                                className="input-area"
                                placeholder="Введите пароль"
                                type="password"
                                onChange={this.onChange}
                                name={'password'}
                                value={this.state.password}
                            />
                        </div>
                        <div className="registration__input">
                            <input
                                className="input-area"
                                placeholder="Повторите пароль"
                                type="password"
                                onChange={this.onChange}
                                name={'repeat_password'}
                                value={this.state.repeat_password}
                            />
                        </div>
                        <div className="registration__submit">
                            <input className="button" type="submit" onClick={this.registration} value="Зарегистрироваться" />
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
)(Registration);
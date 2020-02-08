import React, { Component } from "react";
import {connect} from "react-redux";

class Menu extends Component {
    render () {
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
                                placeholder="Введите Имя"
                                type="text"
                                onChange={this.onChange}
                                name={'name'}
                                value={this.state.name}
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
)(Menu);
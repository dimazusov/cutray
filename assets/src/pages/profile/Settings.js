import React, { Component } from "react";
import {Col} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import cutrayApi from "../../cutrayApi/Api";
import Window from "../../containers/Window";
import { Redirect } from 'react-router-dom';
import AccessManager from "../../accessManager/AccessManager";
import Navigation from "../../containers/Navigation";

class Settings extends Component {
    constructor(props) {
        super(props);

        let allowRoles = ['ROLE_USER'];

        let accessManager = new AccessManager();
        let isAllowAccess = accessManager.check(allowRoles, this.props.userRoles);

        this.state = {
            isAllowAccess: isAllowAccess
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.load = this.load.bind(this);

        if (isAllowAccess) {
            this.load();
        }
    }

    load() {
        let userId = this.props.userId;
        let data = {
            token: this.props.token,
            user: [{id: userId}]
        };

        cutrayApi.get('user', data, (res) => {
            if (res.data.results.length == 0) {

                return ;
            }

            this.props.updateData('email', res.data.results[0].email);
            this.forceUpdate();
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        let source = this.props.source;
        let data   = {token: this.props.token};

        if (this.props.formData.password != this.props.formData.repeat_password) {
            this.props.updateErrors({password: ['Пароли не совпадают']});
            this.props.updateErrors({repeat_password: ['Пароли не совпадают']});

            return ;
        }

        data[source] = [
            {email: this.props.formData.email},
            {password: this.props.formData.password},
        ];

        cutrayApi.update(source, data, (res) => {
            if (cutrayApi.isSuccess(res)) {
                Window.fire('', 'Данные успешно сохранены', 'success');

                return ;
            }

            let errors = cutrayApi.getMessages(res);

            this.props.updateErrors(errors);
        });
    }

    handleChange(event) {
        let name = event.target.name;

        if (name == 'password' || name =='repeat_password') {
            this.props.clearErrorField('password');
            this.props.clearErrorField('repeat_password');
        } else {
            this.props.clearErrorField(event.target.name);
        }

        this.props.updateData(event.target.name, event.target.value);
    }

    getNavigationItems() {
        return [
            {
                'link': '/profile/settings',
                'name': 'Личная информация',
                'isActive': true
            },
            {
                'link': '/profile/history',
                'name': 'История заказов'
            }
        ];
    }

    render () {
        if (!this.state.isAllowAccess) {
            return <Redirect to={'/auth'} />;
        }

        return (
            <div className="wrapper wrapper__border-top wrapper__padding-footer">
                <div className={'catalog'}>
                    <div className={'catalog__menu'}>
                        <Navigation
                            navigationName={'Меню'}
                            items={this.getNavigationItems()} />
                    </div>
                    <div className={'catalog__items'}>
                        <Form
                            className={'text-left'}
                            validated={false}
                            onSubmit={this.handleSubmit}
                        >
                            <Form.Group className={'text-left'} as={Col} md="4" controlId="message">
                                <Form.Label className={'pt-2 pb-2'}>Ваш email:</Form.Label>
                                <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    name="email"
                                    value={this.props.formData.email}
                                    onChange={this.handleChange}
                                    isInvalid={this.props.formErrors.email}
                                />
                                <Form.Control.Feedback>Все верно!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    {this.props.formErrors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className={'text-left'} as={Col} md="4" controlId="subject">
                                <Form.Label className={'pt-2 pb-2'}>Пароль:</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={this.props.formData.password}
                                    onChange={this.handleChange}
                                    isInvalid={this.props.formErrors.password}
                                />
                                <Form.Control.Feedback>Все верно!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    {this.props.formErrors.password}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className={'text-left'} as={Col} md="4" controlId="subject">
                                <Form.Label className={'pt-2 pb-2'}>Повторите пароль:</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="repeat_password"
                                    onChange={this.handleChange}
                                    isInvalid={this.props.formErrors.repeat_password}
                                />
                                <Form.Control.Feedback>Все верно!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    {this.props.formErrors.repeat_password}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button
                                className={'m-3'}
                                type="submit"
                                disabled={this.props.isLoading}
                            >
                                {this.props.isLoading ? 'Загрузка…' : 'Сохранить'}
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state =>  ({
        token: state.profile.token,
        userRoles: state.profile.userRoles,
        userId: state.profile.currentUserId,
        source: state.profile.source,
        formData: state.profile.formData,
        formErrors: state.profile.formErrors,
        isLoading: state.profile.isLoading
    }),
    dispatch => ({
        updateData: (name, value) => {
            dispatch({ type: 'UPDATE_PROFILE_FORM', data: {"name": name, "value": value}});
        },
        updateIsLoading: (value) => {
            dispatch({ type: 'UPDATE_PRODILE_FORM_IS_LOADING', data: {"isLoading": value}});
        },
        updateErrors: (errors) => {
            dispatch({ type: 'UPDATE_ERRORS_PROFILE_FORM', data: errors});
        },
        clearErrorField: (name) => {
            dispatch({ type: 'CLEAR_ERROR_FIELD_PROFILE_FORM', data: {'name':name}});
        }
    })
)(Settings);
import React, { Component } from "react";
import { Container, Col } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import Api from "../cutrayApi/Api";
import Window from "../containers/Window"

class Contacts extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        let source = this.props.source;
        let data = {};

        data[source] = [
            {'subject': this.props.formData.subject},
            {'message': this.props.formData.message},
            {'email': this.props.formData.email}
        ];

        this.props.updateIsLoading(true);

        Api.add(source, data, (res) => {
            this.props.updateIsLoading(false);

            if (Api.isSuccess(res)) {
                this.props.clearData();
                this.props.clearErrors();
                Window.fire('', 'Сообщение успешно отправлено', 'success');

                return ;
            }

            let errors = Api.getMessages(res);

            this.props.updateErrors(errors);
        });
    }

    handleChange(event) {
        this.props.clearErrorField(event.target.name);
        this.props.updateData(event.target.name, event.target.value);

        return false;
    }

    render () {
        return (
            <Container>
                <Form
                    validated={false}
                    onSubmit={this.handleSubmit}
                >
                    <Form.Group as={Col} md="4" controlId="message">
                        <Form.Label>Ваш Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            onChange={this.handleChange}
                            isInvalid={this.props.formErrors.email}
                        />
                        <Form.Control.Feedback>Все верно!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            {this.props.formErrors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="subject">
                        <Form.Label>Тема письма</Form.Label>
                        <Form.Control
                            type="text"
                            name="subject"
                            onChange={this.handleChange}
                            isInvalid={this.props.formErrors.subject}
                        />
                        <Form.Control.Feedback>Все верно!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            {this.props.formErrors.subject}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="message">
                        <Form.Label>Собщение</Form.Label>
                        <Form.Control
                            type="text"
                            as="textarea" rows="4"
                            name="message"
                            onChange={this.handleChange}
                            isInvalid={this.props.formErrors.message}
                        />
                        <Form.Control.Feedback>Все верно!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            {this.props.formErrors.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                        type="submit"
                        disabled={this.props.isLoading}
                    >
                        {this.props.isLoading ? 'Загрузка…' : 'Отправить'}
                    </Button>
                </Form>
            </Container>
        );
    }
}

export default connect(
    state =>  ({
        source: state.contacts.source,
        formData: state.contacts.formData,
        formErrors: state.contacts.formErrors,
        isLoading: state.contacts.isLoading
    }),
    dispatch => ({
        updateData: (name, value) => {
            dispatch({ type: 'UPDATE_CONTACTS_FORM', data: {"name": name, "value": value}});
        },
        updateIsLoading: (value) => {
            dispatch({ type: 'UPDATE_CONTACTS_FORM_IS_LOADING', data: {"isLoading": value}});
        },
        updateErrors: (errors) => {
            dispatch({ type: 'UPDATE_ERRORS_CONTACTS_FORM', data: errors});
        },
        clearErrorField: (name) => {
            dispatch({ type: 'CLEAR_ERROR_FIELD_CONTACTS_FORM', data: {'name':name}});
        },
        clearData: () => {
            dispatch({ type: 'CLEAR_CONTACTS_FORM', data: {}});
        },
        clearErrors: () => {
            dispatch({ type: 'CLEAR_ERROR_CONTACTS_FORM', data: {}});
        }
    })
)(Contacts);
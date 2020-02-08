import React from "react";
import SweetAlert from 'sweetalert2-react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ParentCategory from './FormTypes/ParentCategory';
import UserSelect from './FormTypes/UserSelect';
import Category from './FormTypes/Category';
import Order from './FormTypes/Order';
import Images from './FormTypes/Images';

class CustomForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fields: this.props.fields,
            isInit: false,
            isEdit: this.props.isEdit ? true : false,
            isShowSuccess: false,
            isShowError: false
        };

        if (this.props.onInit != undefined) {
            this.props.onInit(
                ((fields) => {
                    this.setState({...this.state, fields: fields, isInit: true})
                }).bind(this)
            );
        }

        this.onSave = this.onSave.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onImageInit = this.onImageInit.bind(this);
    }

    onSave() {
        this.props.onSave(this.state.fields, (response) => {
            let isShowSuccess = response != undefined;
            let isShowError = response == undefined;

            this.setState({
                ...this.state,
                isShowSuccess: isShowSuccess,
                isShowError: isShowError
            });

            setInterval(() => {
                this.setState({
                    ...this.state,
                    isShowSuccess: false,
                    isShowError: false
                });
            }, 3000);
        });
    }

    onChange(name, value) {
        let fields = [...this.state.fields];

        fields.map((field) => {
            if (field.name == name) {
                field.value = value;
            }
        });

        this.props.onChange(fields);
        this.forceUpdate();
    }

    onImageInit(token) {
        setTimeout(() => { this.onChange('image_hash', token); }, 3000);
    }

    render() {
        let id = parseInt(this.props.id);

        if (!this.state.fields.length) {
            return (
                <div>Данных нет</div>
            );
        }

        return (
            <Container>
                <Form>
                    {this.state.fields.map((field, key) => {
                        if (this.state.isEdit && !field.value) {
                            return <div key={key}>Загрузка</div>;
                        }

                        let formField, type = field.type;

                        if (type == 'imageProduct') {
                            formField = <Images id={id} type='imageProduct' authToken={this.props.token} onInit={this.onImageInit} />
                        } else if (type == 'category') {
                            formField = <Category id={field.value} name={field.name} onChange={this.onChange} />
                        } else if (type == 'userSelect') {
                            formField = <UserSelect id={field.value} token={this.props.token} name={field.name} onChange={this.onChange} location={this.props.location} />
                        } else if (type == 'order') {
                            formField = <Order id={field.value} value={field.value} name={field.name} onChange={this.onChange} location={this.props.location} />
                        } else if (type == 'parentCategory') {
                            formField = <ParentCategory id={field.value} isInit={this.state.isInit} isLastSelected={true} name={field.name} onChange={this.onChange} />
                        } else if (type == 'textarea') {
                            formField = <Form.Control value={field.value} name={field.name} type={field.label} onChange={(e) => {this.onChange(field.name, e.target.value)}} as="textarea" rows="3" />
                        } else {
                            formField = <Form.Control value={field.value} name={field.name} type={field.label} onChange={(e) => {this.onChange(field.name, e.target.value)}} />
                        }

                        return (
                            <Form.Group className={'text-left'} key={key}>
                                <Form.Label className={'pb-2'}>{field.label}</Form.Label>
                                {formField}
                            </Form.Group>
                        )
                    })}

                    <Button onClick={this.onSave} variant="outline-success">Сохранить</Button>

                    <SweetAlert
                        show={this.state.isShowSuccess}
                        text="Данные успешно сохранены"
                        onConfirm={() => {}}
                        timer={3000}
                        confirmButtonColor='#28a745'
                    />
                    <SweetAlert
                        show={this.state.isShowError}
                        text="Ошибка, попробуйте позже"
                        onConfirm={() => {}}
                        timer={3000}
                        confirmButtonColor='#b33e59'
                    />
                </Form>
            </Container>
        );
    }

}

export default CustomForm;


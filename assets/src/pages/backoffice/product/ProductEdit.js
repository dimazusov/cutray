import React from "react";
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux';
import Form from '../../../components/Form';
import { Link } from "react-router-dom"
import BaseEdit from "../BaseEdit";
import { Redirect } from 'react-router-dom';

class ProductEdit extends BaseEdit {
    componentWillMount() {
        this.initEdit();
    }

    render() {
        if (!this.checkAccess(this.props.userRoles)) {
            return <Redirect to={'/'} />;
        }

        return (
            <div className={'wrapper wrapper__padding-backoffice-footer'}>
                <Container className="pt-2 pb-3 text-left">
                    <Link to={"/backoffice/" + this.getSource()}>Назад</Link>
                </Container>

                <Form
                    id={this.getId()}
                    token={this.props.token}
                    fields={this.props.editFields}
                    onChange={this.onChangeFields}
                    onSave={this.onEdit}
                    location={this.props.location}
                    source={this.props.source}
                />
            </div>
        )
    }
}

export default connect(
    state =>  ({
        token: state.profile.token,
        userRoles: state.profile.userRoles,
        source: state.product.source,
        editFields: state.product.editFields
    }),
    dispatch => ({
        changeFields: (data) => {
            dispatch({ type: 'PRODUCT_FIELDS_CHANGE', data: data})
        }
    })
)(ProductEdit);
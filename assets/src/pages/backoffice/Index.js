import React from "react";
import {Container} from "react-bootstrap";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import BaseEdit from "./BaseEdit";

class Index extends BaseEdit {
    render () {
        if (!this.checkAccess(this.props.userRoles)) {
            return <Redirect to={'/'} />;
        }

        return (
            <Container>
                <h4 className="p-3">Добро пожаловать в панель управления.</h4>

                <ul>
                    <li className={'p-2'}>
                        <a href="/backoffice/product">Товары</a>
                    </li>
                    <li className={'p-2'}>
                        <a href="/backoffice/category">Категории</a>
                    </li>
                    <li className={'p-2'}>
                        <a href="/backoffice/order">Заказы</a>
                    </li>
                </ul>
            </Container>
        );
    }
}

export default connect(
    state =>  ({ userRoles: state.profile.userRoles }),
    dispatch => ({})
)(Index);
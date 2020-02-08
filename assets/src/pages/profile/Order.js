import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Api from '../../cutrayApi/Api';
import Order from '../../components/FormTypes/Order';
import Loading from '../../containers/Loading';
import AccessManager from "../../accessManager/AccessManager";
import Navigation from "../../containers/Navigation";

class OrderPage extends Component {
    constructor(props) {
        super(props);

        let allowRoles = ['ROLE_USER'];

        let accessManager = new AccessManager();
        let isAllowAccess = accessManager.check(allowRoles, this.props.userRoles);

        this.state = {
            products: [],
            order: {},
            isEmpty: false,
            isLoading: true,
            isAllowAccess: isAllowAccess
        };

        this.load = this.load.bind(this);

        if (isAllowAccess) {
            this.load();
        }
    }

    load() {
        let data = {
            token: this.props.token,
            order: {
                id: parseInt(this.props.match.params.id)
            }
        };

        Api.get('order', data, (response) => {
            if (response.data.results.length == 0) {
                return ;
            }

            let order = response.data.results[0];

            this.setState({
                ...this.state,
                order: order,
                isLoading: false
            });
        });
    }

    getNavigationItems() {
        return [
            {
                'link': '/profile/settings',
                'name': 'Личная информация'
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

        if (this.state.isLoading) {
            return (
                <Loading isLoading={true} />
            );
        }

        return (
            <div className="wrapper wrapper__border-top wrapper__padding-footer">
                <div className={'catalog p-3'}>
                    <div className={'catalog__menu'}>
                        <Navigation
                            navigationName={'Меню'}
                            items={this.getNavigationItems()} />
                    </div>
                    <div className={'catalog__items'}>
                        <h1 className={'header-page'}>Заказ {this.state.order.id}</h1>

                        <Order
                            value={this.state.order.products}
                            location={this.props.location}
                            name={'name'}
                            isShowAppendButton={false}
                            isCanEdit={false}
                            onChange={(name, value) => {}}
                            productActions={[]}
                        />
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
        currentUserId: state.profile.currentUserId
    }),
    dispatch => ({})
)(OrderPage);
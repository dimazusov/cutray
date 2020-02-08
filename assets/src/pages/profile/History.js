import React, { Component } from 'react';
import Status from '../../containers/Order/Status';
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Image from '../../containers/List/Column/Image';
import cutrayApi from "../../cutrayApi/Api";
import { connect } from "react-redux";
import OrderLink from "../../containers/Order/Link";
import {Link, Redirect} from 'react-router-dom';
import AccessManager from "../../accessManager/AccessManager";
import Navigation from "../../containers/Navigation";

class History extends Component {
    constructor(props) {
        super(props);

        let allowRoles = ['ROLE_USER'];
        let accessManager = new AccessManager();
        let isAllowAccess = accessManager.check(allowRoles, this.props.userRoles);

        this.state = {
            allowRoles: allowRoles,
            isEmpty: false,
            isLoading: true,
            orders: [],
            isAllowAccess: isAllowAccess
        };

        this.loadOrders = this.loadOrders.bind(this);
        this.loadOrdersProducts = this.loadOrdersProducts.bind(this);
        this.getItems = this.getItems.bind(this);

        if (isAllowAccess) {
            this.loadOrders();
        }
    }

    loadOrders() {
        let params = {
            token: this.props.token,
            order: {
                user_id: this.props.userId,
                countOnPage: 1000
            }
        };

        let orderCallback = (response) => {
            if (response.data.length == 0) {
                this.setState({
                    ...this.state,
                    isEmpty: true,
                    isLoading: false
                });

                return ;
            }

            this.loadOrdersProducts(response.data.results);
        };

        cutrayApi.get('order', params, orderCallback);
    }

    loadOrdersProducts(orders) {
        let ids = [];

        orders.map((item) => {
            item.products.map((product) => {
                ids.push(product.product_id);
            })
        });

        ids = this.getUniqueArr(ids);

        let productCallback = (res) => {
            let products = [];

            res.data.results.map((product) => {
                products[product.id] = product;
            });

            orders.map((order) => {
                order.products.map((product) => {
                    product.data = products[product.product_id];
                });
            });

            this.setState(Object.assign({}, {
                ...this.state,
                orders: orders,
                isLoading: false
            }));
        };

        cutrayApi.get('product',{product: {
            ids: ids,
            countOnPage: 1000
        }}, productCallback);
    }

    getUniqueArr(ids) {
        return ids.filter((value, index, self) => {
            return self.indexOf(value) === index;
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
                'name': 'История заказов',
                'isActive': true
            }
        ];
    }

    getItems() {
        if (!this.state.orders.length) {
            return (
                <div>
                    Заказы на найдены вы можете оформить заказ в <Link to={'/cart'}>корзине</Link>
                </div>
            );
        }

        return (
            <Table>
                <Thead>
                    <Tr>
                        <Td>Номер заказа</Td>
                        <Td>Статус</Td>
                        <Td>Товары</Td>
                        <Td>Сумма</Td>
                    </Tr>
                </Thead>
                <Tbody>
                    {this.state.orders.map((item, key) => {
                        return (
                            <Tr key={key}>
                                <Td text-align={'text-center'}>
                                    <OrderLink id={item.id}>Заказ {item.id}</OrderLink>
                                </Td>
                                <Td><Status code={parseInt(item.status)}/></Td>
                                <Td>
                                    {item.products.map((product, index) => {
                                        return <Image className={'img-list'} key={index} imgPaths={product.data.img_paths} />
                                    })}
                                </Td>
                                <Td>{item.amount} р.</Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        );
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
                        {this.getItems()}
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
        userId: state.profile.currentUserId
    }),
    dispatch => ({})
)(History);
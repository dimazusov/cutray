import React, { Component } from "react";
import Order from '../components/FormTypes/Order';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Api from "../cutrayApi/Api";
import Window from "../containers/Window";
import { Link } from "react-router-dom";

class Cart extends Component {
    constructor(props) {
        super(props);

        this.registerOrder = this.registerOrder.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getOrderButton = this.getOrderButton.bind(this);
    }

    registerOrder() {
        let products = [];

        this.props.products.map((item) => {
            products.push({
                id: item.id,
                count: item.count
            })
        });

        let data = {
            token: this.props.token,
            order: [
                {user_id: 1},
                {products: products}
            ]
        };

        Api.add('order', data, (response) => {
            if (!Api.isSuccess(response)) {
                Window.fire(
                    'Ошибка',
                    'На сайте ведуться технические работы, попробуйте позже',
                    'error'
                );

                return ;
            }

            Window.fire(
              'Заказ оформлен',
              'Вы можете просмотреть заказ в личном кабинете',
              'success'
            );

            this.props.clearAll();
        });
    }

    onChange(value) {
        this.props.updateCart(value);
    }

    getOrderButton() {
        if (this.props.userId) {
            return (
                <Button
                    className={'text-left mt-2 mb-4'}
                    variant={'success'}
                    onClick={this.registerOrder} >
                    Заказать
                </Button>
            );
        }

        return (
            <div className={'p-4'}>
                Для заказа <Link to={'/auth'}>авторизуйтесь</Link> или <Link to={'/registration'}>зарегистрируйтесь</Link>
            </div>
        );
    }

    render () {
        if (this.props.products.length == 0) {
            return (
                <div className="wrapper wrapper__border-top wrapper__padding-footer">
                    Корзина пуста
                </div>
            )
        }

        let products = [...this.props.products].map((item) => {
            item.product_id = item.id;

            return item;
        });

        return (
            <div className={'wrapper wrapper__border-top wrapper__padding-footer'}>
                <div className={'container'}>
                    <h1 className={'header-page'}>Корзина:</h1>

                    <Order
                        token={this.props.token}
                        value={products}
                        location={this.props.location}
                        name={'name'}
                        isShowAppendButton={false}
                        productActions={[{
                          'actionName': 'delete',
                          'action': (id) => {
                              this.props.deleteItem(id);
                          }
                        }]}
                        onChange={(name, value) => {
                            this.onChange(value);
                        }}
                    />
                </div>

                {this.getOrderButton()}
            </div>
        );
    }
}

export default connect(
    state =>  ({
        token: state.profile.token,
        userId: state.profile.currentUserId,
        products: state.cart.products
    }),
    dispatch => ({
        updateCart: (products) => {
            dispatch({ type: 'CART_UPDATE_PRODUCTS', data: {products: products}});
        },
        deleteItem: (id) => {
            dispatch({ type: 'CART_DELETE_PRODUCT', data: {id: id}});
        },
        addProductToCart: (id) => {
            dispatch({ type: 'CART_ADD_PRODUCT', data: {id: id}});
        },
        clearAll() {
            dispatch({ type: 'CART_CLEAR', data: {}});
        }
    })
)(Cart);
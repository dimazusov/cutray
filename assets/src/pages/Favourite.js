import React, { Component } from "react";
import ItemList from '../containers/Item/ItemList';
import {connect} from "react-redux";
import Api from "../cutrayApi/Api";

class Favourite extends Component {
    constructor(props) {
        super(props);

        this.loadProducts = this.loadProducts.bind(this);
        this.onFavouriteClick = this.onFavouriteClick.bind(this);

        this.state = {
            products: []
        };

        let ids = [];

        this.props.products.map((item) => {
            ids.push(item.id);
        });

        this.loadProducts(ids);
    }

    loadProducts(ids) {
        Api.get('product', {product: {ids: ids}}, (response) => {
            this.setState(Object.assign(this.state, {products: response.data.results}));
        });
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.props.products != nextProps.products) {
            let ids = [];

            nextProps.products.map((item) => {ids.push(item.id);});

            this.loadProducts(ids);
        }
    }

    onFavouriteClick(id) {
        this.props.deleteProduct(id);
    }

    render () {
        if (this.props.products.length == 0) {
            return (
                <div className="wrapper wrapper__border-top wrapper__padding-footer">
                    Нет избраных товаров
                </div>
            )
        }

        return (
            <div className="wrapper wrapper__border-top wrapper__padding-footer">
                <div className={'container'}>
                    <h1 className={'header-page'}>Избранные:</h1>

                    {this.state.products.map((item, key) => {
                        return (
                            <ItemList
                                key={key}
                                id={item.id}
                                name={item.name}
                                vendor={item.vendor}
                                price={item.price}
                                imgPaths={item.img_paths}
                                onBasketClick={this.onBasketClick}
                                onFavouriteClick={this.onFavouriteClick}
                            />
                        );
                    })}

                </div>
            </div>
        );
    }
}

export default connect(
    state =>  ({
        products: state.favourite.products
    }),
    dispatch => ({
        deleteProduct: (id) => {
            dispatch({ type: 'FAVOURITE_DELETE_PRODUCT', data: {id: id}});
        }
    })
)(Favourite);
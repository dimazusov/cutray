import React, { Component } from "react";
import Api from "../cutrayApi/Api";
import {connect} from "react-redux";
import NotFound from '../containers/NotFound';
import Navigation from '../containers/Navigation';
import ItemList from '../containers/Item/ItemList';
import BreadCrumbsContainer from '../containers/BreadCrumbs';
import BreadCrumbs from '../breadCrumbs/BreadCrumbs';
import DataList from    '../containers/List/DataList';
import queryString from "query-string";

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isNotFound: false,
            breadCrumbsParts: [],
            seonamesFromUrl: [],
            chainSeonames: [],
            page: this.getActivePage(this.props.location)
        };

        this.changePageTo     = this.changePageTo.bind(this);
        this.loadProducts     = this.loadProducts.bind(this);
        this.loadCategories   = this.loadCategories.bind(this);
        this.getActivePage    = this.getActivePage.bind(this);
        this.getMenu          = this.getMenu.bind(this);
        this.getProducts      = this.getProducts.bind(this);
        this.isInCart         = this.isInCart.bind(this);
        this.isFavourite      = this.isFavourite.bind(this);
        this.onBasketClick    = this.onBasketClick.bind(this);
        this.onFavouriteClick = this.onFavouriteClick.bind(this);

        this.init();
    }

    init() {
        let breadCrumbs = new BreadCrumbs(this.props.match.params);
        let callback = (err, chain) => {
            if (err.length != 0) {
                this.setState(Object.assign(this.state, {isNotFound:true}));

                return ;
            }

            let lastCategory = chain[chain.length-1];

            this.props.updateBreadCrumbs(chain);
            this.props.updateCurrentCategory(lastCategory);

            let data =  {
                category: {
                    'cleft': lastCategory.cleft,
                    'cright': lastCategory.cright,
                }
            };

            Api.get('category', data, (response) => {
                let ids = [lastCategory.id];

                response.data.results.map((item) => { ids.push(item.id); });

                let currentCategory = Object.assign(lastCategory, {'childIds': ids});

                this.props.updateCurrentCategory(currentCategory);

                this.loadProducts();
            });

            this.loadCategories(lastCategory.id);
        };

        breadCrumbs.getChain(callback);
    }

    loadCategories(catId) {
        Api.get('category', {category: {'parent_id': catId}}, (res) => {
            if (res.data.results.length == 0) {
                this.props.updateCategories([]);

                return ;
            }

            let categories = res.data.results;
            let pathname = this.props.location.pathname == '/' ? '' : this.props.location.pathname;

            categories.map((item) => {
                item.link = pathname + '/' + item.seoname;
            });

            this.props.updateCategories(res.data.results);
        });
    }

    loadProducts() {
        let productQueryParams = {
            product: {
                category_ids: this.props.currentCategory.childIds,
                page: this.state.page
            }
        };

        if (this.props.searchValue) {
            productQueryParams.product.name = this.props.searchValue;
        }

        Api.get('product', productQueryParams, (response) => {
            this.props.updateData(response.data);
        });
    }

    getActivePage(location) {
        let params = queryString.parse(location.search);

        return params.page != undefined ? parseInt(params.page) : 1;
    }

    changePageTo(page) {
        this.setState(Object.assign(this.state, {'page': page}));

        this.loadProducts();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isSearch) {
            this.loadProducts();

            this.props.updateIsSearch(false);
        }


        if (prevProps.location.pathname != this.props.location.pathname) {
            this.setState(Object.assign(this.state, {'page': 1}));

            this.init();
        }
    }

    onBasketClick(productId) {
        if (this.isInCart(productId)) {
            this.props.deleteProductFromCart(productId);
        } else {
            this.props.addProductToCart(productId);
        }

        this.forceUpdate();
    }

    onFavouriteClick(productId) {
        if (this.isFavourite(productId)) {
            this.props.deleteProductFromFavourite(productId);
        } else {
            this.props.addProductToFavourite(productId);
        }

        this.forceUpdate();
    }

    isFavourite(productId) {
        let favourites = this.props.favourites.filter(item => productId == item.id);
        let isItemFavourite = !!favourites.length;

        return isItemFavourite;
    }

    isInCart(productId) {
        let productsInCart = this.props.productsInCart.filter(item => productId == item.id);
        let isInCart = !!productsInCart.length;

        return isInCart;
    }

    getMenu() {
        return (
            <div className={'catalog__menu'}>
                <Navigation
                    navigationName={'Категории'}
                    items={this.props.categories}
                    onLinkClick={() => {this.props.updateSearchValue('')}}
                />
            </div>
        );
    }

    getProducts() {
        if (this.props.products.length == 0) {
            return (
                <div className={'catalog__items'}>
                    <h2>По Вашему запросу товары не найдены</h2>
                </div>
            );
        }

        return (
            <div className={'catalog__items'}>
                <DataList
                    location={this.props.location}
                    changePageTo={this.changePageTo}
                    totalCount={this.props.totalCount}
                    activePage={this.state.page}
                >
                    {this.props.products.map((item, key) => {
                        return (
                            <ItemList
                                key={key}
                                id={item.id}
                                name={item.name}
                                vendor={item.vendor}
                                price={item.price}
                                imgPaths={item.img_paths}
                                isInCart={this.isInCart(item.id)}
                                isFavourite={this.isFavourite(item.id)}
                                onBasketClick={this.onBasketClick}
                                onFavouriteClick={this.onFavouriteClick}
                            />
                        );
                    })}
                </DataList>
            </div>
        );
    }

    render () {
        if (this.state.isNotFound) {
            return (
                <NotFound />
            );
        }

        return (
            <div className="wrapper wrapper__border-top wrapper__padding-footer">
                <BreadCrumbsContainer
                    values={this.props.breadCrumbs}
                    onLinkClick={() => {this.props.updateSearchValue('')}}
                />
                <div className={'catalog'}>
                    {this.getMenu()}

                    {this.getProducts()}
                </div>
            </div>
        );
    }
}

export default connect(
    state =>  ({
        searchValue:     state.header.searchValue,
        isSearch:        state.header.isSearch,

        favourites:       state.favourite.products,
        productsInCart:   state.cart.products,

        source:          state.list.source,
        isNeedSearch:    state.list.isNeedSearch,
        products:        state.list.data,
        totalCount:      state.list.totalCount,
        currentCategory: state.list.currentCategory,
        breadCrumbs:     state.list.breadCrumbs,
        categories:      state.list.categories
    }),
    dispatch => ({
        updateData: (data) => {
            dispatch({ type: 'LIST_UPDATE_DATA', data: data})
        },
        updateBreadCrumbs: (breadCrumbs) => {
            dispatch({ type: 'LIST_UPDATE_BEADCRUMBS', data: {breadCrumbs: breadCrumbs}})
        },
        updateCategories: (categories) => {
            dispatch({ type: 'LIST_UPDATE_CATEGORIES', data: {categories: categories}})
        },
        updateCurrentCategory: (currentCategory) => {
            dispatch({ type: 'LIST_UPDATE_CURRENT_CATEGORY', data: {'currentCategory': currentCategory}});
        },
        updateIsSearch: (isSearch) => {
            dispatch({ type: 'HEADER_UPDATE_IS_SEARCH', data: {'isSearch': isSearch}});
        },

        addProductToCart: (id) => {
            dispatch({ type: 'CART_ADD_PRODUCT', data: {id: id}});
        },
        deleteProductFromCart: (id) => {
            dispatch({ type: 'CART_DELETE_PRODUCT', data: {id: id}});
        },

        addProductToFavourite: (id) => {
            dispatch({ type: 'FAVOURITE_ADD_PRODUCT', data: {id: id}});
        },
        deleteProductFromFavourite: (id) => {
            dispatch({ type: 'FAVOURITE_DELETE_PRODUCT', data: {id: id}});
        },

        updateSearchValue: (searchValue) => {
            dispatch({ type: 'HEADER_UPDATE_SEARCH_VALUE', data: {searchValue: searchValue}})
        },
    })
)(List);
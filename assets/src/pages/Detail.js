import React, { Component } from "react";
import {connect} from "react-redux";
import {Carousel} from "react-bootstrap";
import Api from "../cutrayApi/Api";
import Whirligig from 'react-whirligig';
import BreadCrumbs from "../breadCrumbs/BreadCrumbs";
import Loading from "../containers/Loading";
import ItemsLink from "../containers/Item/ItemLink";
import NotFound from '../containers/NotFound';
import Image from '../containers/Image';
import ColumnImage from '../containers/List/Column/Image';
import BreadCrumbsContainer from '../containers/BreadCrumbs';

class Detail extends Component {
    constructor(props) {
        super(props);

        let params = this.getParams(this.props.match);
        let id = params ? params.id : null;
        let seoname = params ? params.seoname : null;
        let isNotFound = !params;

        this.state = {
            isNotFound: isNotFound,
            id: id,
            seoname: seoname,
            product: null,
            similars: [],
            carouselSelectItem: 0,
            countSimilar: this.getCountSimilar(),
            isInCart: this.checkInCart.bind(this),
            breadCrumbs: []
        };

        this.init = this.init.bind(this);
        this.getProductById = this.getProductById.bind(this);
        this.getParams = this.getParams.bind(this);
        this.onBasketClick = this.onBasketClick.bind(this);
        this.checkInCart = this.checkInCart.bind(this);

        if (params) {
            this.init();
        }

        window.addEventListener('resize', () => {
            this.setState({
                ...this.state,
                countSimilar: this.getCountSimilar()
            })
        });
    }

    getCountSimilar() {
        const widthChangeCount = 640;

        return widthChangeCount > window.innerWidth ? 3 : 4;
    }

    init() {
        let callback = (product) => {
            let breadCrumbs = new BreadCrumbs({'sub0': product.category.seoname}, false);

            breadCrumbs.getChain((err, breadCrumbs) => {
                this.setState({...this.state, breadCrumbs: breadCrumbs});
            });

            this.getSimilarByCatId(product.category.id, (response) => {
                let similars = response.results.filter(item => item.id != product.id);

                this.setState({
                    ...this.state,
                    product: product,
                    similars: similars
                });
            });
        };

        this.getProductById(callback);
    }

    getProductById(callback) {
        Api.get('product', {product:{id: this.state.id}}, (response) => {
            if (response.data.totalCount == 0) {
                this.setState(Object.assign(this.state, {isNotFound: true}));

                return ;
            }

            callback(response.data.results[0]);
        });
    }

    getSimilarByCatId(catId, callback) {
        Api.get('product', {product:{category_id: catId}}, (response) => {
            callback(response.data);
        });
    }

    getParams(match) {
        if (!match.params.seonameWithId) {
            return ;
        }

        let params = match.params.seonameWithId.split('_');

        if (!params.length == 2) {
            return ;
        }
        let seoname = params[0];
        let id = parseInt(params[1]);

        if (id == NaN) {
            return ;
        }

        return {id: id, seoname: seoname};
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.props.match.url != nextProps.match.url) {
            let params = this.getParams(nextProps.match);
            let id = params ? params.id : null;
            let seoname = params ? params.seoname : null;

            this.setState(Object.assign(this.state, {
                id: id,
                seoname: seoname,
                carouselSelectItem: 0
            }));

            this.init();
        }
    }

    checkInCart() {
        let isInCart = false;

        this.props.cartProducts.map(item => {
            if (item.id == this.state.id) {
                isInCart = true;
            }
        });

        return isInCart;
    }

    onBasketClick() {
        if (this.checkInCart()) {
            this.props.deleteProductToCart(this.state.id);
        } else {
            this.props.addProductToCart(this.state.id);
        }

        this.forceUpdate();
    }

    getCartButton() {
        let isInCart = this.checkInCart();
        let buttontText = isInCart ? 'В корзине': 'Добавить в корзину';
        let buttonClasses = 'item-detail-info__buy-button btn ';

        buttonClasses += isInCart ? 'btn-success': 'btn-outline-success';

        return (
            <button type="button" className={buttonClasses} onClick={this.onBasketClick}>
                {buttontText}
            </button>
        );
    }

    render () {
        if (this.state.isNotFound) {
            return (
                <NotFound />
            );
        }

        if (!this.state.product) {
            return (
                <Loading isLoading={true} />
            );
        }

        let whirligig;
        const next = () => whirligig.next();
        const prev = () => whirligig.prev();

        return (
            <div className="wrapper wrapper__border-top wrapper__padding-footer">
                <BreadCrumbsContainer values={this.state.breadCrumbs}/>

                <div className={'wrapper__content'}>
                    <div className="slider">
                        <Carousel
                            activeIndex={this.state.carouselSelectItem}
                            onSelect={
                                (index) => {
                                    this.setState(Object.assign(this.state, {
                                        carouselSelectItem: index
                                    }));
                                }
                            }>

                            {this.state.product.img_paths.split(',').map((item, key) => {
                                return (
                                    <Carousel.Item className={'text-center'} key={key}>
                                        <Image className="block-inline" src={item} />
                                    </Carousel.Item>
                                );
                            })}
                        </Carousel>
                    </div>
                    <div className="item-detail-info">
                        <div className="item-detail-info__title">{this.state.product.name}</div>
                        <div className="item-detail-info__price">{this.state.product.price} р.</div>
                        {this.getCartButton()}

                        <div className="item-detail-info__category">Категория: {this.state.product.category.name}</div>
                        <div className="item-detail-info__description">{this.state.product.full_description}</div>
                    </div>
                </div>
                <div className={'wrapper__content'}>
                    <div className={'similar'}>
                        <div className={'similar__header'}>Похожие товары:</div>
                        <div className={'similar__body'}>
                            <div className={'similar__left'}>
                                <div className={'similar__left-icon'} onClick={prev}></div>
                            </div>
                            <div className={'similar__right'}>
                                <div className={'similar__right-icon'} onClick={next}></div>
                            </div>
                            <Whirligig
                                className={'similar__slider'}
                                slideClass={'similar__item'}
                                visibleSlides={this.state.countSimilar}
                                ref={(_whirligigInstance) => {
                                    whirligig = _whirligigInstance}
                                }>

                                {this.state.similars.map((item, key) => {
                                    return (
                                        <div className={"item"} key={key}>
                                            <div className={'list__item-im-block'}>
                                                <ItemsLink className={'list__item-im-link'} id={item.id} vendor={item.vendor} >
                                                    <ColumnImage className={"item__preview-img"} imgPaths={item.img_paths}/>
                                                </ItemsLink>
                                            </div>
                                            <div className={"similar__item-name"}>
                                                <ItemsLink id={item.id} vendor={item.vendor} >
                                                    {item.name}
                                                </ItemsLink>
                                            </div>
                                            <div className={"similar__item-price"}>{item.price} р.</div>
                                        </div>
                                    );
                                })}
                            </Whirligig>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state =>  ({
        cartProducts: state.cart.products
    }),
    dispatch => ({
        addProductToCart: (id) => {
            dispatch({ type: 'CART_ADD_PRODUCT', data: {id: id}});
        },
        deleteProductToCart: (id) => {
            dispatch({ type: 'CART_DELETE_PRODUCT', data: {id: id}});
        }
    })
)(Detail);
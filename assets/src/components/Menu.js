import React from "react";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import {connect} from "react-redux";
import { Link } from "react-router-dom";
import { slide as BurgerMenu } from "react-burger-menu";

class Menu extends React.Component {
    constructor(props) {
        super(props)

        this.onMenuStateChange = this.onMenuStateChange.bind(this);
        this.closeMenu         = this.closeMenu.bind(this);
    }

    onMenuStateChange(menuState) {
        if (this.props.isMenuOpen != menuState.isOpen) {
            menuState.isOpen ? this.props.openMenu() : this.props.closeMenu();
        }
    }

    closeMenu() {
        this.props.closeMenu();
    }

    getUserBlockMenu() {
        if (!this.props.userId) {
            return (
                <div className={'burger-menu__block_section'}>
                    <Link className={'burger-menu__link'} onClick={this.closeMenu} to={'/auth'}>Авторизация</Link>
                    <Link className={'burger-menu__link'} onClick={this.closeMenu} to={'/registration'}>Регистрация</Link>
                </div>
            );
        }

        return (
            <div className={'burger-menu__block_section'}>
                <div className={'burger-menu__sub-header'}>Личный кабинет</div>
                <div className={'burger-menu__block'}>
                    <Link className={'burger-menu__link'} onClick={this.closeMenu} to={'/profile/settings'}>Личная информация</Link>
                    <Link className={'burger-menu__link'} onClick={this.closeMenu} to={'/profile/history'}>История заказов</Link>
                </div>
                <div className={'burger-menu__sub-header'}>
                    <Link className={'burger-menu__link'} onClick={this.closeMenu} to={'/logout'}>Выйти</Link>
                </div>
            </div>
        );
    }

    render() {
        return (
            <BurgerMenu pageWrapId={"page-wrap"} onStateChange={this.onMenuStateChange} isOpen={this.props.isMenuOpen}>
                <div className={'burger-menu'}>
                    <h1 className={'burger-menu__header'}>Меню</h1>

                    <Link className={'burger-menu__link'} onClick={this.closeMenu} to={'/cart'}>Корзина</Link>
                    <Link className={'burger-menu__link'} onClick={this.closeMenu} to={'/favourite'}>Избранные</Link>

                    {this.getUserBlockMenu()}

                    <div className={'burger-menu__block_section'}>
                        {this.props.breadCrumbs.map((item, key) => {
                            return (
                                <div key={key}>
                                    <Link className={'burger-menu__link'} onClick={this.closeMenu} to={item.link}>{item.name}</Link>
                                </div>
                            );
                        })}

                        <div className={'burger-menu__block_section'}>
                            {this.props.categories.map((item, key) => {
                                return <Link key={key} className={'burger-menu__link'} onClick={this.closeMenu} to={item.link}>{item.name}</Link>
                            })}
                        </div>
                    </div>
                </div>
            </BurgerMenu>
        );
    }
}

export default connect(
    state =>  ({
        breadCrumbs: state.list.breadCrumbs,
        categories: state.list.categories,
        isMenuOpen: state.header.isMenuOpen,
        userId: state.profile.currentUserId
    }),
    dispatch => ({
        updateCart: (products) => {
            dispatch({ type: 'CART_UPDATE_PRODUCTS', data: {products: products}});
        },
        openMenu() {
            dispatch({ type: 'HEADER_OPEN_MENU', data: {}});
        },
        closeMenu() {
            dispatch({ type: 'HEADER_CLOSE_MENU', data: {}});
        }
    })
)(Menu);

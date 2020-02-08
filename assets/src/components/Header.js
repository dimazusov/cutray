import React from "react";
import {connect} from "react-redux";
import { Link } from "react-router-dom"
import MobileSearch from "../containers/MobileSearch";

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.updateHeader = this.updateHeader.bind(this);
        this.updateIsSearch = this.updateIsSearch.bind(this);
        this.onMobileSearch = this.onMobileSearch.bind(this);

    }

    updateHeader(e) {
        this.props.updateSearchValue(e.target.value);

        this.updateIsSearch();
    }

    updateIsSearch() {
        this.props.updateIsSearch(true);
    }

    getUserBlock() {
        let isAuth = !!this.props.userId;

        if(isAuth) {
            return (
                <div className="auth-block">
                    <Link className="auth-block__profile-link" to={'/profile'} />
                    <Link className="auth-block__profile-logout" to={'/logout'} >выйти</Link>
                </div>
            );
        }

        return (
            <div className="auth-block">
                <Link className="auth-block__auth-link-icon" to={'/auth'} />

                <Link className="auth-block__auth-link" to={'/auth'} >войти</Link>
                <div className="auth-block__delimiter">|</div>
                <Link className="auth-block__reg-link" to={'/registration'} >регистрация</Link>
            </div>
        );
    }

    onMobileSearch(value) {
        this.props.updateSearchValue(value);
        this.props.updateIsSearch(true);
    }

    render() {
        return (
            <header className="header">
                <div className="header__mobile-menu">
                    <div className="header__mobile-menu-link" onClick={() => {this.props.openMenu();}}></div>
                </div>
                <div className="logo header__logo">
                    <Link to={'/'}>
                        <img className="logo__image header__logo-img" src="/img/logo.png" />
                    </Link>
                </div>
                <div className="search header__search">
                    <input className="search__input-text header__search-input-text"
                           type="text"
                           value={this.props.searchValue}
                           onChange={this.updateHeader} />
                    <Link className="search__button" onClick={this.updateIsSearch} to={'/'} />
                </div>

                <MobileSearch onSearch={this.onMobileSearch}/>

                <div className="header__cart">
                    <Link className="header__cart-link" to={'/cart'} />
                </div>
                <div className="header__favourite">
                    <Link className="header__favourite-link" to={'/favourite'} />
                </div>

                {this.getUserBlock()}
            </header>
        );
    }
}

export default connect(
    state =>  ({
        userId: state.profile.currentUserId,
        searchValue: state.header.searchValue,
    }),
    dispatch => ({
        updateSearchValue: (searchValue) => {
            dispatch({ type: 'HEADER_UPDATE_SEARCH_VALUE', data: {searchValue: searchValue}})
        },
        updateIsSearch: (value) => {
            dispatch({ type: 'HEADER_UPDATE_IS_SEARCH', data: {isSearch: value}})
        },
        openMenu() {
            dispatch({ type: 'HEADER_OPEN_MENU', data: {}})
        }
    })
)(Header);
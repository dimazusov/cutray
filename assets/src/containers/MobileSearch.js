import React from "react";

class MobileSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            isBgOpen: false
        };

        this.onSearch = this.onSearch.bind(this);
        this.toogleBg = this.toogleBg.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getSearchInputBlock = this.getSearchInputBlock.bind(this);
    }

    toogleBg() {
        this.setState({...this.state, isBgOpen: !this.state.isBgOpen});
    }

    onSearch() {
        this.toogleBg();
        this.props.onSearch(this.state.value);
    }

    onChange(e) {
        this.setState({...this.state, value: e.target.value});
    }

    getSearchInputBlock() {
        if (this.state.isBgOpen) {
            return (
                <div className={'header__mobile-search-block'}>
                    <input className={'header__mobile-search-input'} onChange={this.onChange} />
                    <div className={'header__mobile-search-button'} onClick={this.onSearch}></div>
                    <div className={'header__mobile-search-bg'} onClick={this.toogleBg}></div>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="header__search-mobile">
                <div className="header__search-mobile-link" onClick={this.toogleBg}></div>

                {this.getSearchInputBlock()}
            </div>
        );
    }
}

export default MobileSearch;
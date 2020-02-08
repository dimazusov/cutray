import React from "react";
import Image from "../../containers/List/Column/Image";
import { Link } from "react-router-dom";

class ItemsList extends React.Component {
    constructor(props) {
        super(props);

        this.getFavouriteClassNames = this.getFavouriteClassNames.bind(this);
        this.getBasketClassNames    = this.getBasketClassNames.bind(this);
    }

    getLink() {
        return '/product/' + this.props.vendor + '_' + this.props.id;
    }

    getFavouriteClassNames() {
        let classes = "item__favourite";

        if (this.props.isFavourite) {
            classes += " item__favourite_selected";
        }

        return classes;
    }

    getBasketClassNames() {
        let classes = "item__basket";

        if (this.props.isInCart) {
            classes += " item__basket_selected";
        }

        return classes;
    }

    render() {
        return (
            <div className="item list__item">
                <div className="list__item-im-block">
                    <Link className={"list__item-im-link"} to={this.getLink()}>
                        <Image
                            className={"item__preview-img"}
                            imgPaths={this.props.imgPaths}
                            defaultImage={'/img/item2v1.jpg'}
                        />
                    </Link>
                </div>
                <div className="item__name">
                    <Link to={this.getLink()}>{this.props.name}</Link>
                </div>

                <div className="item__price">{this.props.price} р.</div>
                <div className={this.getFavouriteClassNames()} onClick={() => {this.props.onFavouriteClick(this.props.id)}}></div>
                <div className={this.getBasketClassNames()} onClick={() => {this.props.onBasketClick(this.props.id)}}></div>
            </div>
        );
    }
}

export default ItemsList;
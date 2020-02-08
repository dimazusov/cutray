import React from "react";
import { Link } from "react-router-dom";

class ItemLink extends React.Component {
    getLink() {
        return '/product/' + this.props.vendor + '_' + this.props.id;
    }

    render() {
        return <Link className={this.props.className} to={this.getLink()}>{this.props.children}</Link>;
    }
}

export default ItemLink;
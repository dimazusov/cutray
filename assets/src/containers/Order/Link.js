import React from "react";
import { Link } from "react-router-dom";

class OrderLink extends React.Component {
    getLink() {
        return '/profile/order/' + this.props.id;
    }

    render() {
        return <Link className={this.props.className} to={this.getLink()}>{this.props.children}</Link>;
    }
}

export default OrderLink;
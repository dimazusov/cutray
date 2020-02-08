import React from "react";
import { Link } from "react-router-dom";

class BreadCrumbs extends React.Component {
    updateSearchValue() {
        this.props.updateSearchValue('');
    }

    render() {
        return (
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {this.props.values.map((item, key) => {
                        return (
                            <li key={key} className="breadcrumb-item active" aria-current="page">
                                <Link to={item.link} onClick={this.props.onLinkClick}>
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        );
    }
}

export default BreadCrumbs;
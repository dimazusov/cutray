import React from "react";
import {Link} from "react-router-dom";

class Navigation extends React.Component {
    render() {
        if (this.props.items.length == 0) {
            return '';
        }

        return (
            <div className="navigation">
                <div className="navigation__header">{this.props.navigationName}:</div>

                {this.props.items.map((item, key) => {
                    let classes = '';

                    if (item.isActive != undefined && item.isActive) {
                        classes += 'navigation__link_active';
                    }

                    return (
                        <div className="navigation__link" key={key}>
                            <Link to={item.link} className={classes} onClick={this.props.onLinkClick}>
                                {item.name}
                            </Link>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default Navigation;



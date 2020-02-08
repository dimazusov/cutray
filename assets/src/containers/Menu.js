import React from "react";
import {Link} from "react-router-dom";
import {Navbar, Nav, NavItem} from 'reactstrap';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            links: [
                {'to': '/backoffice', 'label': 'Главная'},
                {'to': '/backoffice/product', 'label': 'Товары'},
                {'to': '/backoffice/category', 'label': 'Категории'},
                {'to': '/backoffice/order', 'label': 'Заказы'}
            ]
        }
    }

    render() {
        return (
            <div>
                <Navbar color="green" light expand="md">
                    <Nav navbar>
                        {this.state.links.map((item, key) => {
                            return (
                                <NavItem className="p-2" key={key}>
                                    <Link to={item.to}>{item.label}</Link>
                                </NavItem>
                            );
                        })}
                    </Nav>
                </Navbar>
            </div>
        );
    }
}
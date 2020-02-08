import BasePage from "./BasePage";
import {Button, Col, Row} from "react-bootstrap";
import React from "react";

export default class BaseList extends BasePage {
    constructor(props) {
        super(props);

        this.moveToCreate = this.moveToCreate.bind(this);
        this.getListHeader = this.getListHeader.bind(this);
    }

    getListHeader() {
        return (
            <Row>
                <Col>
                    <h2 className="m-2">{this.props.label}</h2>
                </Col>
                <Col>
                    <Button className="m-2 float-right" onClick={this.moveToCreate}>Добавить</Button>
                </Col>
            </Row>
        )
    }

    moveToCreate() {
        window.location = this.props.location.pathname + '/add';
    }


}
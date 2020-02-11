import BasePage from "./BasePage";
import {Button, Col, Container, Row} from "react-bootstrap";
import React from "react";

export default class BaseList extends BasePage {
    constructor(props) {
        super(props);

        this.moveToCreate = this.moveToCreate.bind(this);
        this.getListHeader = this.getListHeader.bind(this);
    }

    getListHeader() {
        return (
            <Container className={'mb-2'}>
                <Row>
                    <Col>
                        <h1 className="header-page p-3 pl-2 float-left">{this.props.label}</h1>
                    </Col>
                    <Col>
                        <Button className="m-3 float-right" onClick={this.moveToCreate}>Добавить</Button>
                    </Col>
                </Row>
            </Container>
        )
    }

    moveToCreate() {
        window.location = this.props.location.pathname + '/add';
    }


}
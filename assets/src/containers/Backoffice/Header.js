import React from "react";
import Menu from "../Menu";
import { Col } from 'reactstrap';

export default () => {
    return (
        <div className="">
            <Col>
                <Menu />
            </Col>
            <hr className="my-1" />
        </div>
    );
}
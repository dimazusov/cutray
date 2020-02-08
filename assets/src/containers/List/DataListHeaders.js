import React from "react";
import {Row, Col} from "react-bootstrap";

class DataListHeaders extends React.Component {
    render() {
        return (
            <Row>
                {this.props.headers.map((item, key) => {
                    return (<Col key={key}>{item}</Col>)
                })}
            </Row>
        );
    }

}

export default DataListHeaders;


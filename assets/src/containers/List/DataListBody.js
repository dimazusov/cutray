import React from "react";
import {Row, Col, Container} from "react-bootstrap";

class DataListBody extends React.Component {
    render() {
        if (!this.props.isLoad) {
            return (
                <Container className={"p-5"}>
                    <div id="fountainG">
                        <div id="fountainG_1" className="fountainG"></div>
                        <div id="fountainG_2" className="fountainG"></div>
                        <div id="fountainG_3" className="fountainG"></div>
                        <div id="fountainG_4" className="fountainG"></div>
                        <div id="fountainG_5" className="fountainG"></div>
                        <div id="fountainG_6" className="fountainG"></div>
                        <div id="fountainG_7" className="fountainG"></div>
                        <div id="fountainG_8" className="fountainG"></div>
                    </div>
                </Container>
            );
        }

        return (
            <Container>
                {this.props.children}
            </Container>
        );
    }

}

export default DataListBody;


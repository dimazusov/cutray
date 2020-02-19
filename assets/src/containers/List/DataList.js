import React from "react";
import {Container} from "react-bootstrap";
import Pagination from "../../components/Pagination";

class DataList extends React.Component {
    render() {
        let defaultCountOnPage = 10;
        let countOnPage = this.props.countOnPage ? this.props.countOnPage : defaultCountOnPage;
        let countPages = Math.ceil(this.props.totalCount / countOnPage);

        return (
            <Container className={'text-center'}>
                {this.props.children}
                <Pagination
                    location={this.props.location}
                    totalCount={this.props.totalCount}
                    changePageTo={this.props.changePageTo}
                    activePage={this.props.activePage}
                    countPages={countPages}
                    countOnPage={countOnPage}
                />
            </Container>
        );
    }
}

export default DataList;


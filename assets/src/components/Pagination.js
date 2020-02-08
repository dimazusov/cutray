import React from "react";
import { Container } from 'react-bootstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Link } from "react-router-dom"

export default class CustomPagination extends React.Component {
    constructor(props) {
        super(props);

        this.changePageTo = this.changePageTo.bind(this);
        this.getPrevLinkToPage = this.getPrevLinkToPage.bind(this);
        this.getNextLinkToPage = this.getNextLinkToPage.bind(this);
        this.getLinkToPage = this.getLinkToPage.bind(this);

        this.state = {
            'showCount': 3,
            'countOnPage': this.props.countOnPage,
            'totalCount': this.props.totalCount,
            'activePage': this.props.activePage,
            'beforeActivePage': 2,
            'afterActivePage': 2
        }
    }

    changePageTo(page) {
        this.props.changePageTo(page);
    }

    getPrevLinkToPage(page) {
        let prevPage = page - 1;

        if (prevPage < 1) {
            return this.getLinkToPage(1);
        }

        return this.getLinkToPage(prevPage);
    }

    getNextLinkToPage(page) {
        let nextPage = page + 1;

        if (nextPage > this.props.countPages) {
            return this.getLinkToPage(this.props.countPages);
        }

        return this.getLinkToPage(nextPage);
    }

    getLinkToPage(page) {
        let urlParams = this.props.location.search.substring(1, this.props.location.search.length);
        let params = urlParams.split('&');
        let link = this.props.location.pathname + '?page=' + page;
        let paramsWithoutPage = params.filter((item) => {
            let paramName = item.split('=')[0];

            if (paramName == 'page') {
                return false
            }

            return true;
        });

        if (!paramsWithoutPage[0]) {
            return link;
        }

        return link + '&' + paramsWithoutPage.join('&');
    }

    render() {
        if (this.props.totalCount == 0) {
            return '';
        }

        let beforeFromPage = this.props.activePage - this.state.beforeActivePage;

        if(beforeFromPage < 1) {
            beforeFromPage = 1;
        }

        let afterToPage = this.props.activePage + this.state.afterActivePage;

        if(afterToPage > this.props.countPages) {
            afterToPage = this.props.countPages;
        }

        let pagItems = [];
        let activePage = this.props.activePage;

        for(let i=beforeFromPage; i<this.props.activePage; i++) {
            pagItems.push(
                <PaginationItem key={'page' + i}>
                    <Link to={this.getLinkToPage(i)} onClick={_ => this.changePageTo(i)}>
                        <PaginationLink>{i}</PaginationLink>
                    </Link>
                </PaginationItem>
            );
        }

        pagItems.push(
            <PaginationItem key='activePage' active>
                <Link to={this.getLinkToPage(activePage)} onClick={_ => this.changePageTo(activePage)}>
                    <PaginationLink>
                        {activePage}
                    </PaginationLink>
                </Link>
            </PaginationItem>
        );

        for(let i=this.props.activePage+1; i<=afterToPage; i++) {
            pagItems.push(
                <PaginationItem key={'page' + i}>
                    <Link to={this.getLinkToPage(i)} onClick={_ => this.changePageTo(i)}>
                        <PaginationLink>
                            {i}
                        </PaginationLink>
                    </Link>
                </PaginationItem>
            );
        }

        let lastPage = this.props.countPages;

        return (
            <Container>
                <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                        <Link to={this.getLinkToPage(1)}  onClick={_ => this.changePageTo(1)}>
                            {'<<'}
                        </Link>
                    </PaginationItem>

                    {pagItems.map((item) => {
                        return item;
                    })}

                    <PaginationItem>
                        <Link to={this.getLinkToPage(lastPage)} onClick={_ => this.changePageTo(lastPage)}>
                            {'>>'}
                        </Link>
                    </PaginationItem>
                </Pagination>
            </Container>
        );
    }
}


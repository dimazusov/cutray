import React from "react";
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import BaseList from '../BaseList';
import List from '../../../components/List';
import { Redirect } from 'react-router-dom';

class ProductList extends BaseList {
    constructor(props) {
        super(props);

        this.updateList = this.updateList.bind(this);
    }

    componentDidMount() {
        this.updateList({
            [this.props.source]: {'page': this.getPage()}
        });
    }

    updateList(params) {
        this.getList(params, (response) => {
            this.props.setProducts(response.data);
        });
    }

    render() {
        if (!this.checkAccess(this.props.userRoles)) {
            return <Redirect to={'/'} />;
        }

        return (
            <Container>
                {this.getListHeader()}

                <List
                    token={this.props.token}
                    location={this.props.location}
                    columns={this.props.showedColumns}
                    data={this.props.data}
                    totalCount={this.props.totalCount}
                    activePage={this.getPage()}
                    source={this.props.source}
                    updateList={this.updateList}
                />
            </Container>
        );
    }
}

export default connect(
    state =>  ({
        token: state.profile.token,
        userRoles: state.profile.userRoles,
        source: state.product.source,
        data: state.product.data,
        label: state.product.label,
        editFields: state.product.editFields,
        totalCount: state.product.totalCount,
        showedColumns: state.product.showedColumns
    }),
    dispatch => ({
        setProducts: (data) => {
            dispatch({ type: 'PRODUCT_SET', data: data});
        },
        setPage: (page) => {
            dispatch({ type: 'PRODUCT_PAGE_SET', page: page});
        }
    })
)(ProductList);

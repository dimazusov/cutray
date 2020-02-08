import React from "react";
import List from '../../../components/List';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import BaseList from '../BaseList';
import { Redirect } from 'react-router-dom';

class CategoryList extends BaseList {
    constructor(props) {
        super(props);

        this.updateList = this.updateList.bind(this);
    }

    componentDidMount() {
        this.updateList({
            [this.props.source]: {
                'page': this.getPage()
            }
        });
    }

    updateList(params) {
        this.getList(params, (response) => {
            this.props.setCategories(response.data);
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
        source: state.category.source,
        data: state.category.data,
        label: state.category.label,
        editFields: state.category.editFields,
        totalCount: state.category.totalCount,
        showedColumns: state.category.showedColumns
    }),
    dispatch => ({
        setCategories: (data) => {
            dispatch({ type: 'CATEGORY_SET', data: data});
        },
        setPage: (page) => {
            dispatch({ type: 'CATEGORY_PAGE_SET', page: page});
        }
    })
)(CategoryList);

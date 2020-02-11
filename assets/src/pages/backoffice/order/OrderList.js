import React from "react";
import { connect } from 'react-redux';
import List from '../../../components/List';
import { Container } from 'react-bootstrap';
import BaseList from '../BaseList';
import { Redirect } from 'react-router-dom';

class OrderList extends BaseList {
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
            this.props.setOrder(response.data);
        });
    }

    render() {
        if (!this.checkAccess(this.props.userRoles)) {
            return <Redirect to={'/'} />;
        }

        return (
            <div className={'wrapper wrapper__padding-backoffice-footer'}>
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
            </div>
        );
    }
}

export default connect(
    state =>  ({
        token: state.profile.token,
        userRoles: state.profile.userRoles,
        source: state.order.source,
        data: state.order.data,
        label: state.order.label,
        editFields: state.order.editFields,
        totalCount: state.order.totalCount,
        showedColumns: state.order.showedColumns
    }),
    dispatch => ({
        setOrder: (data) => {
            dispatch({ type: 'ORDER_SET', data: data});
        },
        setPage: (page) => {
            dispatch({ type: 'ORDER_PAGE_SET', page: page});
        }
    })
)(OrderList);

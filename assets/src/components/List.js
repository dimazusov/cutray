import React from "react";
import { Container, Button } from 'react-bootstrap';
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import EditIcon from 'react-icons/lib/md/edit'
import RemoveIcon from 'react-icons/lib/md/clear'
import Pagination from 'components/Pagination'
import Image from 'containers/List/Column/Image'
import Api from "../cutrayApi/Api";

export default class List extends React.Component {
    constructor(props) {
        super(props);

        this.changePageTo = this.changePageTo.bind(this);
        this.getCountPages = this.getCountPages.bind(this);
        this.getEditLink = this.getEditLink.bind(this);
        this.getTableBody = this.getTableBody.bind(this);

        let countOnPage = 10;

        this.state = {
            countOnPage: countOnPage,
            countPages: Math.ceil(this.props.totalCount / countOnPage),
            totalCount: this.props.totalCount,
            activePage: this.props.activePage,
        }
    }

    getCountPages() {
        return Math.ceil(this.props.totalCount / this.state.countOnPage);
    }

    getEditLink(id) {
        return this.props.location.pathname + '/edit/' + id;
    }

    onDelete(id) {
        let source = this.props.source;
        let params = {
            token: this.props.token,
            [this.props.source]: [{id:id}]
        };

        Api.delete(source, params,() => {
            this.props.updateList({
                [this.props.source]: {
                    'page': this.props.activePage
                }
            });

            this.setState(Object.assign(this.state, {
                countPages: Math.ceil(this.props.totalCount / this.state.countOnPage)
            }));

            this.forceUpdate();
        });
    }

    updateList(params) {
        this.props.updateList(params);
    }

    changePageTo(page) {
        this.props.updateList({
            [this.props.source]: {'page': page}
        });
    }

    getRenderNotFound() {
        return (
            <div>
                <hr/>
                <h5 className='p-3'>Данных нет</h5>
                <hr/>
            </div>
        );
    }

    getTableHeader() {
        return (
            <Thead>
                <Tr className="list-border">
                    {this.props.columns.map((obj, key) => {
                        return <Th key={key}>{obj.label}</Th>
                    })}

                    <Th>Действия</Th>
                </Tr>
            </Thead>
        );
    }

    getTableBody() {
        let data    = this.props.data;
        let columns = this.props.columns;

        return (
            <Tbody>
            {data.map((obj, key) => {
                return (
                    <Tr className="list-border" key={key}>
                        {columns.map((column, columnKey) => {
                            if (column.type == 'image') {
                                return (
                                    <Td key={columnKey}>
                                        <Image imgPaths={obj.img_paths} className={'images-list'}/>
                                    </Td>
                                );
                            }

                            return <Td key={columnKey}>{obj[column.name]}</Td>
                        })}

                        <Td align="left">
                            <a href={this.getEditLink(obj.id)}>
                                <Button variant="link"><EditIcon key='beer' /></Button>
                            </a>
                            <Button onClick={() => {this.onDelete(obj.id)}} variant="link"><RemoveIcon key='beer' /></Button>
                        </Td>
                    </Tr>
                )
            })}
            </Tbody>
        );
    }

    render() {
        let data = this.props.data;

        if (!data || !data.length) {
            return this.getRenderNotFound();
        }

        return (
            <Container>
                <Table>
                    {this.getTableHeader()}

                    {this.getTableBody()}
                </Table>

                <Pagination
                    location={this.props.location}
                    activePage={this.props.activePage}
                    totalCount={this.props.totalCount}
                    countOnPage={this.state.countOnPage}
                    countPages={this.getCountPages()}
                    changePageTo={this.changePageTo}
                />

            </Container>
        );
    }
}


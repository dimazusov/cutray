import React from "react";
import {Button, Container} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import MdControlPoint from 'react-icons/lib/md/control-point'
import {Table, Thead, Tbody, Th, Tr, Td} from "react-super-responsive-table";
import Pagination from './Pagination'
import Api from '../cutrayApi/Api';

export default class SelectWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'page': 1,
            'title': this.props.title,
            'source': this.props.source,
            'searchFields': this.props.searchFields,
            'searchedData': [],
            'totalCount': 0
        };

        this.loadPage();
    }

    loadPage() {
        let data = {
            token: this.props.token
        };
        let params = {page: this.state.page};

        this.state.searchFields.map((item) => {
            return item.value ? params[item.name] = item.value : '';
        });

        data[this.state.source] = params;

        Api.get(this.state.source, data, (response) => {
            let data = response.data;

            this.setState(Object.assign(this.state, {
                'searchedData': data.results,
                'totalCount': data.totalCount
            }));
        });
    }

    updateSearchField(name, value) {
        let searchFields = Object.assign(this.state.searchFields, {});

        searchFields.map((item) => {
            return item.name == name ? item.value = value : '';
        });

        this.setState(Object.assign(this.state, {'searchFields': searchFields}));
        this.loadPage();
    }

    changePageTo(page) {
        this.setState(Object.assign(this.state, {'page': page}));
        this.loadPage();
    }

    getList() {
        return <Table>
            <Thead>
                <Tr>
                    {this.state.searchFields.map((item, key) => {
                        return <Th key={key}>{item.label}</Th>
                    })}
                    <Th key='select'></Th>
                </Tr>
            </Thead>
            <Tbody>
            {this.state.searchedData.map((item, key) => {
                 return (
                     <Tr className="list-border" key={key}>
                         {this.state.searchFields.map((field, fieldKey) => {
                             return (
                                 <Td key={fieldKey}>
                                     {item[field.name]}
                                 </Td>
                             )
                         })}
                         <Td key='select'>
                             <Button variant="link" onClick={() => {
                                 this.props.onSelect(item.id);
                                 this.props.toogleWindow();
                             }} >
                                 <MdControlPoint />
                             </Button>
                         </Td>
                     </Tr>
                 )
             })}
            </Tbody>
        </Table>
    }

    render() {
        return (
            <Container>
                <Modal
                    size="lg"
                    show={this.props.isWindowOpen()}
                    onHide={this.props.toogleWindow}
                    aria-labelledby="example-modal-sizes-title-lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            {this.state.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.searchFields.map((item, key) => {
                            return (
                                <Container key={key} className="pb-3">
                                    {item.label}
                                    <Form.Control
                                        key={key}
                                        name={item.name}
                                        onChange={(e) => {this.updateSearchField(item.name, e.target.value)}}
                                        as="input" />
                                </Container>
                            )
                        })}
                        <hr/>

                        {this.getList()}

                        <Pagination
                            location={this.props.location}
                            activePage={1}
                            totalCount={this.state.totalCount}
                            countOnPage={10}
                            countPages={Math.ceil(this.state.totalCount/10)}
                            changePageTo={(page) => this.changePageTo(page)} />
                    </Modal.Body>
                </Modal>
            </Container>
        );
    }
}


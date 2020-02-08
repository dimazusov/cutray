import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import RemoveIcon from 'react-icons/lib/md/clear'
import Button from 'react-bootstrap/Button';
import Image from 'containers/List/Column/Image';
import ItemLink from "./Item/ItemLink";

class ItemsList extends React.Component {
    getTableHeader() {
        if (!this.props.headers) {
            return '';
        }

        return (
            <Thead>
                <Tr>
                    {this.props.headers.map((item, key) => {
                        return <Th key={key}>{item.label}</Th>
                    })}
                </Tr>
            </Thead>
        );
    }

    getItemContent(headerItem, item) {
        if (headerItem.type == 'count') {
            return (
                <div>
                    <div className={'triangle-left'} onClick={() => {headerItem.action('reduce', item.id)}}></div>
                    <div className={'p-3 d-inline-block justify-content-center'}>{item[headerItem.name]}</div>
                    <div className={'triangle-right'} onClick={() => {headerItem.action('increase', item.id)}}></div>
                </div>
            )
        }

        if (headerItem.type == 'image') {
            return <Image className={'img-list'} imgPaths={item[headerItem.name]}/>
        }

        if (headerItem.type == 'itemLink') {
            return <ItemLink id={item['id']} vendor={item['vendor']}>{item[headerItem.name]}</ItemLink>
        }

        return <div>{item[headerItem.name]}</div>;
    }

    getLine(item, lineKey) {
        return (
            <Tr key={lineKey}>
                {this.props.headers.map((headerItem, key) => {
                    return <Td key={key}>
                        {this.getItemContent(headerItem, item)}
                    </Td>
                })}
                <Td key='actions'>
                {this.props.actions.map((actionItem, key) => {
                    if (actionItem.actionName == 'delete') {
                        return (
                            <Button key={key} onClick={() => {actionItem.action(item.id)}} variant="link">
                                <RemoveIcon key='beer' />
                            </Button>
                        )
                    }
                })}
                </Td>
            </Tr>
        )
    }

    render() {
        return (
            <Table>
                {this.getTableHeader()}

                <Tbody>
                    {this.props.body.map((item, key) => {
                        return this.getLine(item, key);
                    })}
                </Tbody>
            </Table>
        );
    }
}

export default ItemsList;
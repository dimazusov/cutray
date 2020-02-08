import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { mount } from 'enzyme';

import ItemsList from "containers/ItemsList";

it('checking params', () => {
    let headers = [
        {
            name: 'id',
            label: 'Уникальный номер'
        },
        {
            name: 'name',
            label: 'Имя'
        }
    ];

    let body = [
        {
            id: 1,
            name: 'Игорь'
        }
    ];

    let actions = [
        {
            actionName: 'delete',
            action: () => { }
        }
    ];

    const wrapper = mount(<ItemsList headers={headers} body={body} actions={actions}/>);

    let headerText = wrapper.find('thead').find('tr').find('th').at(0).text();
    let bodyText = wrapper.find('tbody').find('tr').at(0).find('td').at(1).find('div').at(1).text();

    expect(headerText).toEqual(headers[0].label);
    expect(bodyText).toEqual(body[0].name);
});
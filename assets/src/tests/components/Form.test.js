import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { mount } from 'enzyme';

import Form from "components/Form";

it('renders without crashing', () => {
    let fields = [
        {
            value: 'test',
            name: 'test',
            label: 'Тест',
            type: 'default'
        }
    ];

    const wrapper = mount(<Form fields={fields} />);
});

it('change without crashing', () => {
    let testField = {
        value: 'test value',
        name: 'testname',
        label: 'Тест',
        type: 'default'
    };
    let fields = [testField];
    let changedValue = 'test123';

    let onChange = (fields) => {
        expect(fields[0].name).toEqual(testField.name);
        expect(fields[0].value).toEqual(testField.value);
    };

    const wrapper = mount(<Form fields={fields} onChange={onChange}/>);
    const event = {target: {name: testField.name, value: changedValue}};

    wrapper
        .find('div')
        .find('form')
        .find('input[name="testname"]')
        .simulate('change', {event});
});
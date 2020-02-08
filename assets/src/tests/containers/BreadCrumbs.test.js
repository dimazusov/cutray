import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';

import BreadCrumbs from "../../containers/BreadCrumbs";
import { MemoryRouter } from 'react-router-dom';

it('renders without crashing', () => {
    let items = [
        {
            link: "/",
            name: "Главная"
        },
        {
            link: "/domiki",
            name: "Домики"
        }
    ];

    const wrapper = mount(<MemoryRouter><BreadCrumbs values={items} /></MemoryRouter>);

    expect(wrapper.find('ol').find('li').length).toBe(items.length);
});
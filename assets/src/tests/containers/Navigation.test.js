import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { mount } from 'enzyme';

import Navigation from "containers/Navigation";
import { MemoryRouter } from 'react-router-dom';

it('checking params', () => {
    let categories = [
        {
            link: '/',
            name: 'Главная'
        },
        {
            link: '/domiki',
            name: 'Домики'
        }
    ];

    const wrapper = mount(<MemoryRouter><Navigation items={categories}/></MemoryRouter>);

    let textFirstCat = wrapper.find('.navigation').find('.navigation__link').at(0).find('a').text()
    let textSecondCat = wrapper.find('.navigation').find('.navigation__link').at(1).find('a').text()

    expect(textFirstCat).toEqual(categories[0].name);
    expect(textSecondCat).toEqual(categories[1].name);
});
import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { mount, shallow } from 'enzyme';

import MobileSearch from "containers/MobileSearch";

it('checking params', () => {
    const wrapper = mount(<MobileSearch />);

    wrapper.find('.header__search-mobile')
        .find('.header__search-mobile-link')
        .simulate('click');

    expect(wrapper.state().isBgOpen).toEqual(true);

    expect(wrapper.find('.header__search-mobile').exists('.header__mobile-search-block')).toEqual(true);
});
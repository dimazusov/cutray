import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { mount, shallow } from 'enzyme';

import { MemoryRouter } from "react-router-dom";
import Menu from "../../containers/Menu";

it('renders without crashing', () => {
    const wrapper = mount(<MemoryRouter><Menu /></MemoryRouter>);
});
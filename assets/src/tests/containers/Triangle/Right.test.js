import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { mount } from 'enzyme';

import TriangleRight from "containers/Triangle/Right";

it('renders without crashing', () => {
    const wrapper = mount(<TriangleRight />);
});
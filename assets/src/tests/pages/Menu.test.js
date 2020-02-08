import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';

import Menu from "../../pages/Menu";

it('renders without crashing', () => {
    const app = shallow(<Menu />);

    expect(app).toMatchSnapshot();
});
import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';

import List from "../../pages/List";

it('renders without crashing', () => {
    const app = shallow(<List />);

    expect(app).toMatchSnapshot();
});
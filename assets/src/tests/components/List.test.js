import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';

import List from "components/List";

it('renders without crashing', () => {
    const wrapper = shallow(<List data={[]} columns={[]} />);
});
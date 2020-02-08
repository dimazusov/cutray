import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';

import Favourite from "../../pages/Favourite";

it('renders without crashing', () => {
    const app = shallow(<Favourite />);

    expect(app).toMatchSnapshot();
});
import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, } from 'enzyme';

import Footer from "../../containers/Footer";

it('renders without crashing', () => {
    const app = shallow(<Footer />);

    expect(app).toMatchSnapshot();
});
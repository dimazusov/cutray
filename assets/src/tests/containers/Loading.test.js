import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { mount, shallow } from 'enzyme';

import Loading from "containers/Loading";

it('renders without crashing', () => {
    const wrapperNoLoading = shallow(<Loading />);
    const wrapperLoading   = shallow(<Loading isLoading={true} />);

    expect(wrapperNoLoading.exists('div')).toEqual(false);
    expect(wrapperLoading.exists('div')).toEqual(true);
});
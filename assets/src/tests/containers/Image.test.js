import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { mount } from 'enzyme';

import Image from "../../containers/Image";

it('checking params', () => {
    let className = 'test';
    let alt = 'test alt';
    let src = 'test21412';

    const wrapper = mount(<Image className={className} alt={alt} src={src}/>);

    expect(wrapper.prop('className')).toEqual(className);
    expect(wrapper.prop('src')).toEqual(src);
    expect(wrapper.prop('alt')).toEqual(alt);
});
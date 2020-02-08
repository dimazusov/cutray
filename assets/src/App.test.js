import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';

import rootReducer from './reducers'
import { createStore } from 'redux'

const store = createStore(rootReducer);

import App from "./App";

it('render app without crashing', () => {
  const app = shallow(<App store={store}/>);
});
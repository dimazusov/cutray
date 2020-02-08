import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import contacts from './contacts';
import category from './backoffice/category';
import product from './backoffice/product';
import order from './backoffice/order';
import list from './list';
import cart from './cart';
import profile from './profile';
import favourite from './favourite';
import header from './header';

export default combineReducers({
  routing: routerReducer,

  header,
  contacts,
  list,
  cart,
  favourite,
  profile,

  product,
  category,
  order
});

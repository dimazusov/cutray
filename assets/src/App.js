import React from 'react';
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import './css/app/App.css';
import './css/reset.css';
import './css/backoffice/Backoffice.css';

import List from "./pages/List";
import Index from "./pages/backoffice/Index";

import ProductList from "./pages/backoffice/product/ProductList";
import ProductAdd from "./pages/backoffice/product/ProductAdd";
import ProductEdit from "./pages/backoffice/product/ProductEdit";

import CategoryList from "./pages/backoffice/category/CategoryList";
import CategoryAdd from "./pages/backoffice/category/CategoryAdd";
import CategoryEdit from "./pages/backoffice/category/CategoryEdit";

import OrderList from "./pages/backoffice/order/OrderList";
import OrderAdd from "./pages/backoffice/order/OrderAdd";
import OrderEdit from "./pages/backoffice/order/OrderEdit";

import BackofficeHeader from './containers/Backoffice/Header';

import Header from './components/Header';
import Footer from './containers/Footer';

import Authorization from "./pages/Authorization";
import Registration from "./pages/Registration";
import Logout from "./pages/Logout";
import Settings from "./pages/profile/Settings";
import History from "./pages/profile/History";
import Order from "./pages/profile/Order";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Contacts from "./pages/Contacts";
import Favourite from "./pages/Favourite";
import Menu from './components/Menu';
import DocumentTitle from 'react-document-title';

const App = ({ store }) => {
    return (
        <Provider store={store}>
            <Router>
                <DocumentTitle title={'Cutray'}>
                <div>
                    <Menu />

                    <Switch>
                        <Route path="/backoffice" children={<BackofficeHeader />} />
                        <Route path="/" children={<Header />} />
                    </Switch>

                    <Switch>
                        <Route exact path="/product/:seonameWithId" component={Detail} />

                        <Route exact path="/cart" component={Cart} />
                        <Route exact path="/favourite" component={Favourite} />
                        <Route exact path="/contacts" component={Contacts} />

                        <Redirect exact from='/profile' to='/profile/history'/>
                        <Route exact path="/profile/settings" component={Settings} />
                        <Route exact path="/profile/history" component={History} />
                        <Route exact path="/profile/order/:id" component={Order} />

                        <Route exact path="/auth" component={Authorization} />
                        <Route exact path="/registration" component={Registration} />
                        <Route exact from='/logout' component={Logout} />

                        <Route exact path="/backoffice" component={Index} />
                        <Route exact path="/backoffice/product" component={ProductList} />
                        <Route exact path="/backoffice/product/add" component={ProductAdd} />
                        <Route exact path="/backoffice/product/edit/:id" component={ProductEdit} />
                        <Route exact path="/backoffice/category" component={CategoryList} />
                        <Route exact path="/backoffice/category/add" component={CategoryAdd} />
                        <Route exact path="/backoffice/category/edit/:id" component={CategoryEdit} />
                        <Route exact path="/backoffice/order" component={OrderList} />
                        <Route exact path="/backoffice/order/add" component={OrderAdd} />
                        <Route exact path="/backoffice/order/edit/:id" component={OrderEdit} />

                        <Route path="/:sub0/:sub1/:sub2/:sub3" component={List} />
                        <Route path="/:sub0/:sub1/:sub2" component={List} />
                        <Route path="/:sub0/:sub1" component={List} />
                        <Route path="/:sub0" component={List} />
                        <Route path="/" component={List} />
                    </Switch>

                    <Route path="/" children={<Footer />} />
                </div>
                </DocumentTitle>
            </Router>
        </Provider>
    )
};

App.propTypes = {
    store: PropTypes.object.isRequired
}

export default App;
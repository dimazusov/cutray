import React from "react";
import { Input } from 'reactstrap';
import api from '../../cutrayApi/Api'

class Category extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.initCategory = this.initCategory.bind(this);
        this.getCategory = this.getCategory.bind(this);
        this.getParentCallback = this.getParentCallback.bind(this);
        this.removeChildrenBehindFrom = this.removeChildrenBehindFrom.bind(this);

        this.state = {
            'categories': [],
            'isInit': false,
            'isLoading': true,
            'afterInit': () => {},
            'initCategoryId': this.props.id
        };

        this.initCategory(0);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.isInit || !this.props.id) {
            return ;
        }

        this.setState(Object.assign(this.state, {isInit:true}));

        if (this.state.isLoading) {
            this.setState(Object.assign(this.state, {afterInit: () => {
                this.removeChildrenBehindFrom(0);
                this.initCategory(this.props.id);
            }}));
        } else {
            this.removeChildrenBehindFrom(0);
            this.initCategory(this.props.id);
        }
    }

    initCategory(id) {
        let callback = (response) => {
            let data = response.data;

            if (!data.results.length || this.state.categories.length == 5) {
                return ;
            }

            let selectedId = this.state.selectedId;

            data.results.map((value) => {
                if (value.id == this.props.id) {
                    selectedId = this.props.id;
                }
            });


            let results = data.results.filter(value => value.id != this.props.fadeCategoryId);

            this.setState(Object.assign(this.state, {
                'categories':[{'childs': results, 'selectedId': selectedId}, ...this.state.categories],
                'selectedId': data.results[0]['parent_id'],
                'isLoading': false
            }));

            if(this.state.afterInit) {
                this.state.afterInit();

                Object.assign(this.state, {'afterInit': false});
            }

            if (data.results[0]['parent_id'] == 0) {
                return ;
            }

            this.getCategory(data.results[0]['parent_id'], (response) => {
                let data = response.data;
                this.getParentCategories(data.results[0]['parent_id'], callback);
            });
        }

        if (id == 0) {
            return this.getParentCategories(id, callback);
        }

        this.getCategory(id, (response) => {
            let data = response.data;

            if(!data.results.length) {
                this.getParentCategories(0, callback);

                return ;
            }

            this.getParentCategories(data.results[0]['parent_id'], callback);
        });
    }

    getParentCallback(response) {
        let data = response.data;

        if (!data.results.length) {
            return ;
        }

        let newState = Object.assign({}, this.state);
        let results = data.results.filter(value => value.id != this.props.fadeCategoryId);

        newState.categories[newState.categories.length] = {'childs': results};
        newState.isLoading = false;

        this.setState(newState);
    }

    getParentCategories(parent_id, callback) {
        var params = {
            'category': {
                'parent_id': parent_id,
                'countOnPage': 100
            }
        };

        api.get('category', params, callback);
    }

    getCategory(id, callback) {
        api.get('category', {'category': {'id': id}}, callback);
    }

    removeChildrenBehindFrom(value) {
        let newState = Object.assign({}, this.state);

        newState.categories = newState.categories.slice(0, value);

        this.setState(newState);
    }

    onChange(e) {
        let id = parseInt(e.target.id);
        let newState = Object.assign({}, this.state);

        newState.isLoading = false;
        newState.categories[id].selectedId = parseInt(e.target.value);

        this.setState(newState);

        this.setState(Object.assign(this.state, {isInit: true}));

        this.removeChildrenBehindFrom(id + 1);

        if (e.target.value == -1 || e.target.value == 0) {
            return ;
        }

        this.getParentCategories(e.target.value, this.getParentCallback);

        this.props.onChange(this.props.name, e.target.value);
    }

    render() {
        return (
            <div>
                {this.state.categories.map((item, key) => {
                    return (
                        <Input key={key}
                               type="select"
                               value={item.selectedId}
                               name={this.props.name}
                               id={key}
                               className="mt-2 mb-3"
                               onMouseDown={this.init}
                               onChange={this.onChange}>
                            <option key={-1} value='0'>Не выбрано</option>
                            {item.childs.map((childCategory, keyChildCategory) => {
                                return (
                                    <option key={keyChildCategory} value={childCategory.id}>{childCategory.name}</option>
                                )
                            })}
                        </Input>
                    )
                })}
            </div>
        );
    }
}

export default Category;

import React from "react";
import Button from 'react-bootstrap/Button';
import SelectWindow from '../../components/SelectWindow';
import ItemsList from "../../containers/ItemsList";
import Api from "../../cutrayApi/Api";
import PropTypes from 'prop-types';

class Order extends React.Component {
    constructor(props) {
        super(props);

        let isCanEdit = this.props.isCanEdit != undefined ? this.props.isCanEdit : true;
        let countType = isCanEdit ? 'count' : 'text' ;

        this.state = {
            'isSelectWindowOpen': false,
            'titleSelectWindow': 'Выбор товара',
            'selectWindowSource': 'product',
            'searchFieldsSelectWindow': [
                {
                    'label': 'Id',
                    'name': 'id',
                    'value': ''
                },
                {
                    'label': 'Имя',
                    'name': 'name',
                    'value': ''
                },
                {
                    'label': 'Aртикул',
                    'name': 'vendor',
                    'value': ''
                }
            ],
            'isCanEdit': isCanEdit,
            'productHeaders': [
                {
                    'label': 'Id',
                    'name': 'id'
                },
                {
                    'label': 'Изображение',
                    'name': 'img_paths',
                    'type': 'image',
                },
                {
                    'label': 'Название',
                    'name': 'name',
                    'type': 'itemLink'
                },
                {
                    'label': 'Кол-во',
                    'name': 'count',
                    'type': countType,
                    'action': this.countAction.bind(this)
                },
                {
                    'label': 'Цена за штуку',
                    'name': 'price'
                }
            ],
            'productsData': [],
            'productActions': [
                {
                    'actionName': 'delete',
                    'action': (id) => {
                        this.onDelete(id)
                    }
                }
            ]
        };

        if (this.props.productActions) {
            this.state.productActions = this.props.productActions;
        }

        this.isWindowOpen = this.isWindowOpen.bind(this);
        this.toogleWindow = this.toogleWindow.bind(this);
        this.getAppendButton = this.getAppendButton.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.getTotal = this.getTotal.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        if (this.props.value) {
            this.props.value.map((item) => {
                this.onSelect(item.product_id, item.count);
            });
        }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.props.value.length != nextProps.value.length) {

            if (this.props.value.length > nextProps.value.length) {
                let productsData = this.state.productsData.filter((item) => {
                    let isExists = false;

                    nextProps.value.map((product) => {
                        if (product.id == item.id) {
                            isExists = true;
                        }
                    });

                    return isExists;
                });

                this.setState({...this.state, productsData: productsData});
            }
        }
    }

    countAction(actionType, id) {
        let productsData = Object.assign(this.state.productsData, {});

        productsData.map((item) => {
            if (item.id == id) {
                if (actionType == 'increase' ) {
                    item.count++;
                } else if (item.count != 0) {
                    item.count--;
                }
            }
        });

        this.setState({ ...this.state, productsData: productsData });
        this.onChange();
    }

    onDelete(id) {
        let productsData = this.state.productsData.filter((item) => item.id != id);

        this.setState(Object.assign(this.state, {
            productsData: productsData
        }));

        this.onChange();
    }

    isWindowOpen() {
        return this.state.isSelectWindowOpen;
    }

    toogleWindow() {
        this.setState({
            ...this.state,
            isSelectWindowOpen: !this.state.isSelectWindowOpen
        });
    }

    onSelect(selectedId, count=1) {
        for (let key in this.state.productsData) {
            if (this.state.productsData[key].id == selectedId) {
                return ;
            }
        }

        let data = {'product': {'id': selectedId}};

        Api.get('product', data, (response) => {
            let data = response.data;

            if (!data.results.length) {
                return false;
            }

            let productsData = this.state.productsData.slice();
            let product = data.results[0];
            product.count = count;
            productsData.push(product);

            this.setState(Object.assign(this.state, {
                'productsData': productsData,
            }));

            this.onChange();
        });
    }

    getTotal() {
        return this.state.productsData.reduce((sum, item) => {
            return sum + item.price*item.count;
        }, 0);
    }

    onChange() {
        let productData = [];

        this.state.productsData.map(item => {
            productData.push({
                'id':item.id,
                'count':item.count
            });
        });

        this.props.onChange(this.props.name, productData);
    }

    getAppendButton() {
        if (this.props.isShowAppendButton == false) {
            return null;
        }

        return <Button onClick={this.toogleWindow} className={"mt-3"} >Добавить товар</Button>;
    }

    render() {
        let total = this.getTotal();
        return (
            <div>
                <ItemsList
                    headers={this.state.productHeaders}
                    body={this.state.productsData}
                    actions={this.state.productActions}
                />
                <div className={'pl-2 pt-3 text-left'}>Всего: {total} р.</div>

                {this.getAppendButton()}
                
                <SelectWindow
                    isWindowOpen={this.isWindowOpen}
                    toogleWindow={this.toogleWindow}
                    location={this.props.location}
                    title={this.state.titleSelectWindow}
                    source={this.state.selectWindowSource}
                    onSelect={this.onSelect}
                    searchFields={this.state.searchFieldsSelectWindow}
                />
            </div>
        );
    }
}

Order.propTypes = {
    value: PropTypes.array,
    location: PropTypes.object,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

export default Order;
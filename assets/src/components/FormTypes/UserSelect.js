import React from "react";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';

import SelectWindow from '../../components/SelectWindow';
import Api from '../../cutrayApi/Api';

class UserSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'isSelect': !!this.props.id ,
            'isSelectWindowOpen': false,
            'titleSelectWindow': 'Выбор клиента',
            'selectWindowSource': 'user',
            'searchFieldsSelectWindow': [
                {
                    'label': 'Id',
                    'name': 'id',
                    'value': '',
                },
                {
                    'label': 'Email',
                    'name': 'email',
                    'value': ''
                }
            ],
            'user': {
                'id': 0,
                'email': ''
            },
            'value': '',
        };

        this.getUserById = this.getUserById.bind(this);
        this.isWindowOpen = this.isWindowOpen.bind(this);
        this.toogleWindow = this.toogleWindow.bind(this);
        this.onChange = this.onChange.bind(this)
    }

    componentDidMount() {
        this.getUserById(this.props.id);
    }

    getUserById(id) {
        let data = {
            token: this.props.token,
            user: {
                id: id
            }
        };
        Api.get('user', data, (response) => {
            let data = response.data;

            if (data.results.length) {
                this.setState(Object.assign(this.state, {
                    'isSelected': true,
                    'user': {
                        id: data.results[0].id,
                        email: data.results[0].email
                    }
                }));
            }
        });
    }

    toogleWindow() {
        this.setState(Object.assign(this.state, {
            'isSelectWindowOpen': !this.state.isSelectWindowOpen
        }));
    }

    isWindowOpen() {
        return this.state.isSelectWindowOpen;
    }

    onChange(selectedId) {
        this.props.onChange(this.props.name, selectedId);
        this.getUserById(selectedId);
    }

    render() {
        return (
            <Container>
                <Button onClick={this.toogleWindow} >
                    {this.state.user.id ? "Изменить" : "Не выбрано"}
                </Button>
                <div className={'inline ml-3'}>{this.state.user.email}</div>
                <SelectWindow
                    token={this.props.token}
                    isWindowOpen={this.isWindowOpen}
                    toogleWindow={this.toogleWindow}
                    location={this.props.location}
                    title={this.state.titleSelectWindow}
                    source={this.state.selectWindowSource}
                    onSelect={this.onChange}
                    searchFields={this.state.searchFieldsSelectWindow}
                />
            </Container>
        );
    }
}

export default UserSelect;

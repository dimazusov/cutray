import React from "react";
import Container from 'react-bootstrap/Container';
import RemoveIcon from 'react-icons/lib/md/clear'
import AddIcon from 'react-icons/lib/md/control-point'
import imagesApi from '../../cutrayApi/ImagesApi';
import { If, Then } from 'react-if'

class Images extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            imageToken: '',
            authToken: this.props.authToken
        };

        let data = {'type': this.props.type};

        if (this.props.id) {
            data['id'] = this.props.id;
        }

        imagesApi.getImageToken(data, (data) => {
            let newState = Object.assign({}, this.state);

            newState.imageToken = data.token;
            newState.images = [];

            data.blobs.map((item) => {
                newState.images.push({ source: 'data:image/jpeg;base64,' + item})
            });

            this.setState(newState);
            this.props.onInit(data.token);
        });
    }

    onChange(e) {
        let callback = (data) => {
            let newState = Object.assign({}, this.state);

            newState.images[data.position] = { source: 'data:image/jpeg;base64,' + data.blob};

            this.setState(newState);
        };

        let params = {
            'authToken': this.state.authToken,
            'token': this.state.imageToken,
            'position': e.target.getAttribute('position'),
            'image': e.target.files[0],
        };

        imagesApi.add(params, callback.bind(this));
    }

    onAdd(e) {
        if (!e.target.files.length) {
            return ;
        }

        let position = this.state.images.length;

        let callback = (data) => {
            let newState = Object.assign({}, this.state);

            newState.images.push({ source: 'data:image/jpeg;base64,' + data.blob});

            this.setState(newState);
        };

        let params = {
            authToken: this.state.authToken,
            token: this.state.imageToken,
            position: position,
            image: e.target.files[0]
        };

        imagesApi.add(params, callback.bind(this));
    }

    onDelete(position) {
        let callback = (data) => {
            let newState = {...this.state};

            newState.images.splice(position, 1);

            this.setState(newState);
        };

        let data = {
            authToken: this.state.authToken,
            token: this.state.imageToken,
            position: position
        };

        imagesApi.delete(data, callback.bind(this));
    }

    render() {
        return (
            <Container>
                {this.state.images.map((item, key) => {
                    return (
                        <div key={key} className="images-outblock">
                            <div className="images-innerblock">
                                <RemoveIcon className="images-icon-remove" key="beer" onClick={() => {this.onDelete(key)}}/>
                                <img className="images-imageblock" src={item.source} />
                                <input className="images-input" position={key} onChange={this.onChange.bind(this)} type="file"/>
                            </div>
                        </div>
                    )
                })}

                <If condition={this.state.images.length < 10}>
                    <Then>
                        <div className="images-outblock">
                            <div className="images-innerblock">
                                <AddIcon className="images-addblock" />
                                <input className="images-input" onChange={this.onAdd.bind(this)} type="file"/>
                            </div>
                        </div>
                    </Then>
                </If>
            </Container>
        );
    }
}

export default Images;
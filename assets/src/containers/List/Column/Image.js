import React from "react";

class Image extends React.Component {
    render() {

        if(this.props.imgPaths) {
            let paths = this.props.imgPaths.split(',');
            let src = 'http://' + window.location.hostname + '/img/product/' + paths[0];

            return (
                <img className={this.props.className} src={src} alt=""/>
            );
        }

        if (this.props.defaultImage) {
            return <img className={this.props.className} src={this.props.defaultImage} alt=""/>
        }

        return <div>Нет изображения</div>;
    }

}

export default Image;


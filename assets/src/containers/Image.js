import React from "react";
import PropTypes from 'prop-types';

class Image extends React.Component {
    render() {
        let alt = this.props.alt ? this.props.alt : '';
        let className = this.props.className ? this.props.className : '';
        let src = 'http://' + window.location.hostname + '/img/product/' + this.props.src;

        return <img className={className} src={src} alt={alt} />;
    }
}

Image.propTypes = {
    src: PropTypes.string.isRequired
}

export default Image;


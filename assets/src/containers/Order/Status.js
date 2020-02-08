import React from "react";
import PropTypes from 'prop-types';

class Status extends React.Component {
    getStatusDescription(statusCode) {
        if (statusCode == '101') {
            return 'Новый';
        }

        if (statusCode == '200') {
            return 'В работе';
        }

        if (statusCode == '300') {
            return 'Успешно';
        }

        if (statusCode == '401') {
            return 'Отменен пользователем';
        }

        if (statusCode == '402') {
            return 'Отменен менеджером';
        }
    }

    render() {
        return <div className={this.props.className}>{this.getStatusDescription(this.props.code)}</div>
    }
}

Status.propTypes = {
    code: PropTypes.number.isRequired
};

export default Status;
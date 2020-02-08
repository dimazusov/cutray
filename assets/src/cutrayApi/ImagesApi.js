import axios from 'axios';

export default {
    add: function(data, callback) {
        this._query('add', data, callback);
    },
    delete: function(data, callback) {
        this._query('delete', data, callback);
    },
    getImageToken: function(data, callback) {
        this._query('getToken', data, callback);
    },
    _query: function(queryType, data, callback) {
        let formData = new FormData();
        let url = this._getUrl(queryType);
        let headers = {
            'Content-Type': 'multipart/form-data'
        };

        if (data['authRoken'] != undefined) {
            headers['X-AUTH-TOKEN'] = data['authRoken'];

            delete data['authRoken'];
        }

        for (let key in data) {
            formData.append(key, data[key]);
        }

        axios.post(url, formData, {
            headers: headers
        })
        .then(function (response) {
            callback(response.data);
        })
        .catch(function (e) {
            console.log('error');
            console.log(e);
        });
    },
    _getHost() {
        let host = window.location.origin;
        let hostWithoutPort = host.match(/^http[s]?:\/\/[a-zA-Z\-0-9\.]+/)[0];

        return hostWithoutPort;
    },
    _getUrl: function(queryType) {
        let apiUrl = this._getHost() + '/_api/image';

        if (queryType == 'add') {
            apiUrl += '/add';
        }

        if (queryType == 'delete') {
            apiUrl += '/delete';
        }

        if (queryType == 'getToken') {
            apiUrl += '/get/token';
        }

        return apiUrl;
    }
}
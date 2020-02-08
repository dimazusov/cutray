import axios from 'axios';
const qs = require('query-string');

export default {
    register(params, callback) {
        this.__query(this._getApiUrl() + '/reg', params, callback);
    },
    auth(params, callback) {
        this.__query(this._getApiUrl() + '/auth', params, callback);
    },
    logout(params, callback) {
        this.__query(this._getApiUrl() + '/logout', params, callback);
    },
    getInfo(params, callback) {
        this.__query(this._getApiUrl() + '/user-info', params, callback);
    },
    __query(url, params, callback) {
        let config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }};

        if (params.token != undefined) {
            config.headers['X-AUTH-TOKEN'] = params.token;
            delete params.token;
        }

        axios.post(url, qs.stringify(params), config)
        .then((res) => {
            callback(res);
        })
        .catch((err) => {
            console.log(err);
        });
    },
    _getApiUrl() {
        let host = window.location.origin;
        let hostWithoutPort = host.match(/^http[s]?:\/\/[a-zA-Z\-0-9\.]+/)[0];

        return hostWithoutPort + '/_api';
    }
}
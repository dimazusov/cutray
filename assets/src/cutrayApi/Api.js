import axios from 'axios';

const statusFieldName = 'status';
const errMesssageFieldName = 'messages';
const statusError = 'error';
const statusSuccess = 'success';

export default {
    get: function(source, data, callback) {
        this._query('get', source, data, callback);
    },

    add: function(source, data, callback) {
        this._query('add', source, data, callback);
    },
    update: function(source, data, callback) {
        this._query('update', source, data, callback);
    },
    delete: function(source, data, callback) {
        this._query('delete', source, data, callback);
    },
    _query: function(queryType, source, data, callback) {
        let headers = {};

        if (data['token'] != undefined) {
            headers['X-AUTH-TOKEN'] = data['token'];

            delete data['token'];
        }

        var method = queryType == 'get' ? 'get' : 'post';
        var url    = this._buildUrl(queryType, source, data);
        var params = {};

        if(method == 'post') {
            params = new URLSearchParams();
            for (var key in data) {
                data[key].forEach((obj) => {
                    var keys = Object.keys(obj);

                    if (typeof obj[keys[0]] == 'object') {
                        obj[keys[0]].map((it,itKey) => {
                            Object.keys(it).map(fieldName => {
                                let path = key + '[' + keys[0] + ']['+itKey+']['+fieldName+']';

                                params.append(path, obj[keys[0]][itKey][fieldName]);
                            })
                        })
                    } else {
                        params.append(key + '[' + keys[0] + ']', obj[keys[0]]);
                    }
                });
            }
        }

        axios({
            method: method,
            url: url,
            data: params,
            headers: headers
        }).then(function (response) {
            callback(response.data);
        })
        .catch(function (e) {
              console.log('error');
              console.log(e);
        });
    },
    _buildGetParams: function (data, parent = '') {
        var queryParams = '';

        for (var key in data) {
            if (typeof data[key] === 'object') {
                if(parent == '') {
                    queryParams += this._buildGetParams(data[key], key);
                } else {
                    queryParams += this._buildGetParams(data[key], parent + '[' + key + ']');
                }
            } else {
                queryParams += parent + '[' + key + ']' + '=' + data[key] + '&';
            }
        }

        if (parent == '') {
            queryParams = queryParams.substring(0, queryParams.length - 1);
        }

        return queryParams;
    },
    _buildUrl: function (queryType, source, data) {
        let url = this._getHost() + '/_api/' + source + '/' + queryType;

        if(queryType == 'get') {
            url += '?' + this._buildGetParams(data);
        }

        return url;
    },
    _getHost() {
        let host = window.location.origin;
        let hostWithoutPort = host.match(/^http[s]?:\/\/[a-zA-Z\-0-9\.]+/)[0];

        return hostWithoutPort;
    },
    getMessages(response) {
        return response[errMesssageFieldName];
    },
    isSuccess(response) {
        return response[statusFieldName] == statusSuccess;
    }
}
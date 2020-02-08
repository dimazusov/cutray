import React from "react";
import queryString from "query-string";
import Api from "../../cutrayApi/Api";
import AccessManager from "../../accessManager/AccessManager";

export default class BasePage extends React.Component{
    getPage() {
        let params = queryString.parse(this.props.location.search);
        let page = params.page != undefined ? params.page : 1;

        return parseInt(page);
    }

    getList(data, callback) {
        data.token = this.props.token;

        Api.get(this.props.source, data, callback);
    }

    onSave(source, data, callback) {
        data.token = this.props.token;

        Api.add(source, data, callback);
    }

    getSource() {
        return this.props.source;
    }

    checkAccess(userRoles) {
        let allowRoles = ['ROLE_ADMIN'];

        let accessManager = new AccessManager();

        return accessManager.check(allowRoles, userRoles);
    }
}
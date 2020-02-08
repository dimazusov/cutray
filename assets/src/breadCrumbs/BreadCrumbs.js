import Api from "../cutrayApi/Api";

export default class BreadCrumbs {
    constructor(params, isNeedCheckChain = true) {
        let seonamesFromUrl = [];

        // get sub parameters
        [0,1,2,3].map((item) => {
            let nameSubPart = 'sub' + item;

            if (params[nameSubPart]) {
                seonamesFromUrl.push(params[nameSubPart]);
            }
        });

        this.isNeedCheckChain = isNeedCheckChain;
        this.seonamesFromUrl = seonamesFromUrl;
        this.chainCategories = [];
        this.mainCategory = {
            'id': "0",
            'name': 'Главная',
            'seoname': '',
            'link':'/',
            'cleft': 0,
            'cright': 100000,
        };
    }

    getChain(callback) {
        if (this.seonamesFromUrl.length == 0) {
            callback([], [this.mainCategory]);

            return ;
        }

        let lastSubCat = this.seonamesFromUrl[this.seonamesFromUrl.length-1];

        Api.get('category', {category: {'seoname': lastSubCat}}, (res) => {
            if (res.data.results.length == 0) {
                callback([{'error': 'Such category' + lastSubCat + ' not found'}], []);

                return ;
            }

            this.chainCategories.push(res.data.results[0]);

            this.loadBreadCrumbs(res.data.results[0].parent_id, callback);
        });
    }

    loadBreadCrumbs(parentId, callback) {
        if (parentId == 0) {
            this.chainCategories = this.chainCategories.reverse();

            if (!this.checkChain() && this.isNeedCheckChain) {
                callback([{'error': 'Such category not found'}], []);

                return ;
            }

            let path = '';

            this.chainCategories.map((item) => {
                path += '/' + item.seoname;
                item.link = path;
            });

            this.chainCategories.unshift(this.mainCategory);

            callback([], this.chainCategories);

            return ;
        }

        Api.get('category', {category: {'id': parentId}}, (res) => {
            if (res.data.results.length == 0) {
                callback([{'error': 'Such category not found'}], []);

                return ;
            }

            this.chainCategories.push(res.data.results[0]);

            this.loadBreadCrumbs(res.data.results[0].parent_id, callback);
        });
    }

    checkChain() {
        for (let i = 0; i < this.seonamesFromUrl.length; i++) {
            if (this.seonamesFromUrl[i] != this.chainCategories[i]['seoname']) {
                return false;
            }
        }

        return true;
    }
}
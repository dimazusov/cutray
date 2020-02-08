import BasePage from "./BasePage";
import Api from '../../cutrayApi/Api.js'

export default class BaseEdit extends BasePage {
    constructor(props) {
        super(props);

        this.getId = this.getId.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.initEdit = this.initEdit.bind(this);
        this.onChangeFields = this.onChangeFields.bind(this);
    }

    getId() {
        return this.props.match.params.id;
    }

    onChangeFields(fields) {
        this.props.changeFields(Object.assign({}, fields));
    }

    onSave(fields, callback = () => {}) {
        let data = {
            token: this.props.token,
            [this.props.source]:[]
        };

        fields.forEach((obj) => {
            data[this.props.source].push({[obj.name]: obj.value});
        });

        Api.add(this.props.source, data, callback);
    }

    onEdit(fields, callback = () => {}) {
        let data = {
            token: this.props.token,
            [this.props.source]:[]
        };

        let id  = this.props.match.params.id;

        data[this.props.source].push({'id': id});

        fields.forEach((obj) => {
            data[this.props.source].push({[obj.name]: obj.value});
        });

        Api.update(this.props.source, data, callback);
    }

    initEdit() {
        let id  = this.props.match.params.id;
        let changeFields = this.props.changeFields;

        this.getList({[this.props.source]: {'id': id}}, (response) => {
            let data = response.data;
            let values = data.results[0];
            let fields = Object.assign(this.props.editFields, {});

            for (let key in fields) {
                fields[key].value = values[fields[key].name];
            }

            this.forceUpdate();

            changeFields(fields);
        });
    }
}
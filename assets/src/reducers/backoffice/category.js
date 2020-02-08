const initialState = {
    label: 'Категории',
    source: 'category',
    data: [],
    totalCount: 0,
    editFields: [
        {
            label: 'Имя',
            type: 'input',
            name: 'name',
            value: ''
        },
        {
            label: 'Seoname',
            type: 'input',
            name: 'seoname',
            value: ''
        },
        {
            label: 'Родительская категория',
            type: 'parentCategory',
            name: 'parent_id',
            value: 0
        }
    ],
    showedColumns: [
        {
            'label': 'Id',
            'name': 'id',
        },
        {
            'label': 'Имя',
            'name': 'name',
        },
        {
            'label': 'Seoname',
            'name': 'seoname',
        },
    ]
};

export default function (state = initialState, action) {
    let newState = Object.assign({}, state);

    if (action.type === 'CATEGORY_SET') {
        newState.data = action.data.results;
        newState.totalCount = action.data.totalCount;

        return newState;
    }

    if (action.type === 'CATEGORY_DELETE_BY_ID') {
        newState.data = newState.data.filter(obj => obj.id != action.id);

        return newState;
    }

    if (action.type === 'CATEGORY_FIELDS_CHANGE') {
        newState.editFields = action.data;

        return newState;
    }

    return newState;
}

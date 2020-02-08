const initialState = {
    label: 'Заказы',
    source: 'order',
    data: [],
    totalCount: 0,
    editFields: [
        {
            label: 'Выбор клиента',
            type: 'userSelect',
            name: 'user_id',
            value: 0
        },
        {
            label: 'Товары',
            type: 'order',
            name: 'products',
            value: 0
        }
    ],
    showedColumns: [
        {
            'label': 'Id',
            'name': 'id',
        },
        {
            'label': 'Пользователь',
            'name': 'user_id',
        },
        {
            'label': 'Сумма',
            'name': 'amount',
        }
    ]
};

export default function (state = initialState, action) {
    let newState = Object.assign({}, state);

    if (action.type === 'ORDER_SET') {
        newState.data = action.data.results;
        newState.totalCount = action.data.totalCount;

        return newState;
    }

    if (action.type === 'ORDER_DELETE_BY_ID') {
        newState.data = newState.data.filter(obj => obj.id != action.id);

        return newState;
    }

    if (action.type === 'ORDER_FIELDS_CHANGE') {
        newState.editFields = action.data;

        return newState;
    }

    return newState;
}

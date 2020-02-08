const initialState = {
    label: 'Товары',
    source: 'product',
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
            label: 'Артикль',
            type: 'input',
            name: 'vendor',
            value: ''
        },
        {
            label: 'Цена',
            type: 'input',
            name: 'price',
            value: ''
        },
        {
            label: 'Категория',
            type: 'category',
            name: 'category_id',
            value: 0
        },
        {
            label: 'Описание',
            type: 'textarea',
            name: 'description',
            value: ''
        },
        {
            label: 'Полное описание',
            type: 'textarea',
            name: 'full_description',
            value: ''
        },
        {
            label: 'Изображения',
            type: 'imageProduct',
            name: 'image_hash',
            value: ''
        }
    ],
    showedColumns: [
        {
            label: 'Id',
            name: 'id',
        },
        {
            label: 'Картинка',
            name: 'img_paths',
            type: 'image'
        },
        {
            label: 'Имя',
            name: 'name',
        },
        {
            label: 'Артикль',
            name: 'vendor',
        },
        {
            label: 'Цена',
            name: 'price',
        }
    ]
};

export default function (state = initialState, action) {
    let newState = Object.assign({}, state);

    if (action.type === 'PRODUCT_SET') {
        newState.data = action.data.results;
        newState.totalCount = action.data.totalCount;

        return newState;
    }

    if (action.type === 'PRODUCT_FIELDS_CHANGE') {
        newState.editFields = action.data;

        return newState;
    }

    if (action.type === 'PRODUCT_IMAGE_HASH_CHANGE') {
        newState.editFields.forEach((item) => {
            if (item.name == 'image_hash') {
                item.value = action.data.hash;
            }
        });

        return newState;
    }

    return newState;
}

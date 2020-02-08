function getFavouriteProductFromLocalStorage() {
    let results = localStorage.getItem('favourite');

    if (results == null) {
        return [];
    }

    return JSON.parse(results);
}

const initialState = {
    products: getFavouriteProductFromLocalStorage()
};

export default function (state = initialState, action) {
    let newState = Object.assign({}, state);

    if (action.type === 'FAVOURITE_UPDATE') {
        newState.products = action.data.results;

        localStorage.setItem('favourite', newState.products);

        return newState;
    }

    if (action.type === 'FAVOURITE_ADD_PRODUCT') {
        let isFind = false;

        newState.products.map((item) => {
            if (item.id == action.data.id) {
                isFind = true;
            }
        });

        if (!isFind) {
            newState.products.push({
                id: action.data.id
            });

            localStorage.setItem('favourite', JSON.stringify(newState.products));
        }

        return newState;
    }

    if (action.type === 'FAVOURITE_DELETE_PRODUCT') {
        newState.products = newState.products.filter((item) => {
            return item.id != action.data.id;
        });

        localStorage.setItem('favourite', JSON.stringify(newState.products));

        return newState;
    }

    if (action.type === 'FAVOURITE_UPDATE_PRODUCTS') {
        newState.products = action.data.products;

        localStorage.setItem('favourite', JSON.stringify(newState.products));

        return newState;
    }

    if (action.type === 'FAVOURITE_CLEAR') {
        newState.products = [];

        localStorage.setItem('favourite', JSON.stringify([]));

        return newState;
    }

    return newState;
}
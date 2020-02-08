function getProductFromLocalStorage() {
    let results = localStorage.getItem('cart');

    if (results == null) {
        return [];
    }

    return JSON.parse(results);
}

const initialState = {
    products: getProductFromLocalStorage()
};

export default function (state = initialState, action) {
    let newState = Object.assign({}, state);

    if (action.type === 'CART_UPDATE') {
        newState.products = action.data.results;

        localStorage.setItem('cart', newState.products);

        return newState;
    }

    if (action.type === 'CART_ADD_PRODUCT') {
        let isFind = false;

        newState.products.map((item) => {
            if (item.id == action.data.id) {
                isFind = true;
            }
        });

        if (!isFind) {

            newState.products.push({
                id: action.data.id,
                count: 1
            });

            localStorage.setItem('cart', JSON.stringify(newState.products));
        }

        return newState;
    }

    if (action.type === 'CART_DELETE_PRODUCT') {
        newState.products = newState.products.filter((item) => {
            return item.id != action.data.id;
        });

        localStorage.setItem('cart', JSON.stringify(newState.products));

        return newState;
    }

    if (action.type === 'CART_UPDATE_PRODUCTS') {
        newState.products = action.data.products;

        localStorage.setItem('cart', JSON.stringify(newState.products));

        return newState;
    }

    if (action.type === 'CART_CLEAR') {
        newState.products = [];

        localStorage.setItem('cart', JSON.stringify([]));

        return newState;
    }

    return newState;

}

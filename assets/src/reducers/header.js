const initialState = {
    searchValue: '',
    isSearch: false,
    isMenuOpen: false
};

export default function (state = initialState, action) {
    let newState = Object.assign({}, state);

    if (action.type === 'HEADER_UPDATE_SEARCH_VALUE') {
        newState.searchValue = action.data.searchValue;

        return newState;
    }

    if (action.type === 'HEADER_UPDATE_IS_SEARCH') {
        newState.isSearch = action.data.isSearch;

        return newState;
    }

    if (action.type === 'HEADER_OPEN_MENU') {
        newState.isMenuOpen = true;

        return newState;
    }

    if (action.type === 'HEADER_CLOSE_MENU') {
        newState.isMenuOpen = false;

        return newState;
    }

    return newState;
}

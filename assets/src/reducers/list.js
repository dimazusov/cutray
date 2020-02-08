const initialState = {
    source: 'product',
    isNeedSearch: false,
    breadCrumbs: [],
    data: [],
    categories:[],
    currentCategory: null,
    totalCount: 0,
};

export default function (state = initialState, action) {
    let newState = Object.assign({}, state);

    if (action.type === 'LIST_UPDATE_DATA') {
        newState.data = action.data.results;
        newState.totalCount = action.data.totalCount;

        return newState;
    }

    if (action.type === 'LIST_UPDATE_CATEGORIES') {
        newState.categories = action.data.categories;

        return newState;
    }

    if (action.type === 'LIST_UPDATE_IS_NEED_SEARCH') {
        newState.isNeedSearch = action.data.isNeedSearch;

        return newState;
    }

    if (action.type === 'LIST_UPDATE_CURRENT_CATEGORY') {
        newState.currentCategory = action.data.currentCategory;

        return newState;
    }

    if (action.type === 'LIST_UPDATE_BEADCRUMBS') {
        newState.breadCrumbs = action.data.breadCrumbs;

        return newState;
    }

    return newState;
}

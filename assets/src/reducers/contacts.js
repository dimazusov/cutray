const initialState = {
    source: 'contacts',
    formData: {
        'subject': '',
        'message': '',
        'email': ''
    },
    formErrors: {
        'subject': '',
        'message': '',
        'email': '',
    },
    isLoading: false,
};

export default function (state = initialState, action) {
    let newState = Object.assign({}, state);

    if (action.type === 'CONTACTS_ADD') {

        return newState;
    }

    if (action.type === 'UPDATE_CONTACTS_FORM') {
        newState.formData[action.data.name] = action.data.value;

        return newState;
    }

    if (action.type === 'UPDATE_CONTACTS_FORM_IS_LOADING') {
        newState.isLoading = action.data.isLoading;

        return newState;
    }

    if (action.type === 'UPDATE_ERRORS_CONTACTS_FORM') {
        let formErrors = Object.assign({}, state.formErrors);

        Object.keys(action.data).map(item => {
            formErrors[item] = action.data[item];
        });

        newState.formErrors = formErrors;

        return newState;
    }

    if (action.type === 'CLEAR_ERROR_FIELD_CONTACTS_FORM') {
        let formErrors = Object.assign({}, state.formErrors);

        formErrors[action.data.name] = '';

        newState.formErrors = formErrors;

        return newState;
    }

    if (action.type === 'CLEAR_ERROR_CONTACTS_FORM') {
        let formErrors = initialState.formErrors;

        newState.formErrors = formErrors;

        return newState;
    }

    if (action.type === 'CLEAR_CONTACTS_FORM') {
        newState = Object.assign({}, initialState);

        return newState;
    }

    return newState;
}

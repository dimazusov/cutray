function getCurrentIdFromLocalStorage() {
    let result = localStorage.getItem('current_user_id');

    return result == null ? 0 : parseInt(result);
}

function getUserRolesFromLocalStorage() {
    let results = localStorage.getItem('user_roles');

    return results == null ? ['ROLE_UNKNOWN'] : JSON.parse(results);
}

function getTokenFromLocalStorage() {
    return localStorage.getItem('token');
}

const initialState = {
    currentUserId: getCurrentIdFromLocalStorage(),
    userRoles: getUserRolesFromLocalStorage(),
    token: getTokenFromLocalStorage(),

    accessRoles: ['ROLE_USER', 'ROLE_ADMIN'],
    source: 'user',
    formData: {
        email: '',
        password: '',
        repeat_password: ''
    },
    formErrors: {
        email: '',
        password: '',
        repeat_password: '',
    },
    isLoading: false,
};

export default function (state = initialState, action) {
    let newState = Object.assign({}, state);

    if (action.type === 'CLEAR_PROFILE_USER_DATA') {
        newState.currentUserId = 0;
        newState.token         = null;
        newState.userRoles     = ['ROLE_UNKNOWN'];

        localStorage.removeItem('current_user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('user_roles');

        return newState;
    }

    if (action.type === 'UPDATE_PROFILE_USER_DATA') {
        newState.currentUserId = action.data.user_id;
        newState.token         = action.data.token;
        newState.userRoles     = action.data.userRoles;

        localStorage.setItem('current_user_id', newState.currentUserId);
        localStorage.setItem('token', newState.token);
        localStorage.setItem('user_roles', JSON.stringify(newState.userRoles));

        return newState;
    }

    if (action.type === 'UPDATE_PROFILE_USER_ROLES') {
        newState.userRoles = action.data.userRoles;

        return newState;
    }

    if (action.type === 'UPDATE_PROFILE_FORM') {
        newState.formData[action.data.name] = action.data.value;

        return newState;
    }

    if (action.type === 'UPDATE_PROFILE_FORM_IS_LOADING') {
        newState.isLoading = action.data.isLoading;

        return newState;
    }

    if (action.type === 'UPDATE_ERRORS_PROFILE_FORM') {
        let formErrors = Object.assign({}, state.formErrors);

        Object.keys(action.data).map(item => {
            formErrors[item] = action.data[item];
        });

        newState.formErrors = formErrors;

        return newState;
    }

    if (action.type === 'CLEAR_ERROR_FIELD_PROFILE_FORM') {
        let formErrors = Object.assign({}, state.formErrors);

        formErrors[action.data.name] = '';

        newState.formErrors = formErrors;

        return newState;
    }

    if (action.type === 'CLEAR_ERROR_PROFILE_FORM') {
        let formErrors = initialState.formErrors;

        newState.formErrors = formErrors;

        return newState;
    }

    if (action.type === 'CLEAR_PROFILE_FORM') {
        newState = Object.assign({}, initialState);

        return newState;
    }

    return newState;
}

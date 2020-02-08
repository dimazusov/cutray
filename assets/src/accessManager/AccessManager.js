class AccessManager {
    check (allowRoles, userRoles) {
        let arr = allowRoles.filter((item) => {
            return userRoles.indexOf(item) != -1;
        });

        return !!arr.length;
    }
}

export default AccessManager;
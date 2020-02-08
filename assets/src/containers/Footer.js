import React from 'react';

export default () => {
    return (
        <footer className="footer">
            <div className="logo footer__logo">
                <img className="logo__image logo__image_min" src="/img/logo.png" />
            </div>

            <div className="year footer__year">
                {( new Date()).getFullYear()}
            </div>
        </footer>
    );
}
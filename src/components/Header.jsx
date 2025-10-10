import React from 'react';

function Header({title}) {
    const fullTitle = title ? `${title} - E-Commerce Application` : 'E-Commerce Application';
    return (
        <head>
            <title>
                {fullTitle}
            </title>

            <meta name="description" content="E-Commerce Application"/>
            <link rel="icon" href="/favicon.ico"/>
        </head>
    );
}

export default Header;
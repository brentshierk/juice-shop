"use strict";
/*
 * Copyright (c) 2014-2021 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
module.exports = (sequelize, { INTEGER }) => {
    const BasketItem = sequelize.define('BasketItem', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        quantity: INTEGER
    });
    return BasketItem;
};
//# sourceMappingURL=basketitem.js.map
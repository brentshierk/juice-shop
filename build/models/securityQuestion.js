"use strict";
/*
 * Copyright (c) 2014-2021 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
module.exports = (sequelize, { STRING }) => {
    const SecurityQuestion = sequelize.define('SecurityQuestion', {
        question: STRING
    });
    return SecurityQuestion;
};
//# sourceMappingURL=securityQuestion.js.map
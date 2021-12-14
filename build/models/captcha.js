"use strict";
/*
 * Copyright (c) 2014-2021 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
module.exports = (sequelize, { INTEGER, STRING }) => {
    const Captcha = sequelize.define('Captcha', {
        captchaId: INTEGER,
        captcha: STRING,
        answer: STRING
    });
    return Captcha;
};
//# sourceMappingURL=captcha.js.map
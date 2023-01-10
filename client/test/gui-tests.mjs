import * as assert from "assert";
import {expect} from "chai";
import Homepage from "./pageobjects/homepage.mjs";
import Registerpage from "./pageobjects/registerpage.mjs";
import UserData from "./pageobjects/UserData.mjs";
import Loginpage from "./pageobjects/loginpage.mjs";
import {Builder} from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox.js";

describe("Tests if website is reachable", function() {
    let driver = null;

    before(async function() {
        driver = await new Builder().withCapabilities({acceptInsecureCerts: true})
            .forBrowser('firefox')
            .setFirefoxOptions(new firefox.Options().headless())
            .build();

    });

    it("Homepage find project titel in header", async () => {
        let homepage = new Homepage(driver);
        let baseUrl = "https://localhost:8080";
        await homepage.goToUrl(baseUrl);
        let title = await homepage.getText(".header > h1:nth-child(1)")
        assert.equal(title, "Babylon Community");
    });

    after(async function() {
        await driver.quit();
    });



});


describe("Register Test for the signup form", function() {
    let driver = null;

    before(async function() {
        driver = await new Builder().withCapabilities({acceptInsecureCerts: true})
            .forBrowser('firefox')
            .setFirefoxOptions(new firefox.Options().headless())
            .build();

    });


    it("Should not be a valid firstname", async () => {
        let registerpage = new Registerpage(driver);
        let baseUrl = "https://localhost:8080/register";
        let user = new UserData(
            "Pipi!",
            "Langstrumpf",
            "pipi",
            "pipi@gmail.com",
            "12345678",
            "12345678");

        await registerpage.goToUrl(baseUrl);
        await registerpage.fillForm(user);
        let errormessage = await registerpage.getMainErrorMessage();
        assert.equal(errormessage, "firstname Invalid / Forbidden characters");

    });

    it("Should not be a valid lastname", async () => {
        let registerpage = new Registerpage(driver);
        let baseUrl = "https://localhost:8080/register";
        let user = new UserData(
            "Pipi",
            "Langstrumpf!",
            "pipi",
            "pipi@gmail.com",
            "12345678",
            "12345678");

        await registerpage.goToUrl(baseUrl);
        await registerpage.fillForm(user);
        let errormessage = await registerpage.getMainErrorMessage();
        assert.equal(errormessage, "lastname Invalid / Forbidden characters");
    });

    it("Should not be a valid email", async () => {
        let registerpage = new Registerpage(driver);
        let baseUrl = "https://localhost:8080/register";
        let user = new UserData(
            "Pipi",
            "Langstrumpf",
            "pipi",
            "pipi@gmail",
            "12345678",
            "12345678");

        await registerpage.goToUrl(baseUrl);
        await registerpage.fillForm(user);
        let errormessage = await registerpage.getErrorMessageEmail();
        assert.equal(errormessage, "Value is not a valid email address");
    });

    it("Should not be same password", async () => {
        let registerpage = new Registerpage(driver);
        let baseUrl = "https://localhost:8080/register";
        let user = new UserData(
            "Pipi",
            "Langstrumpf",
            "pipi",
            "pipi@gmail.com",
            "12345678",
            "12345678!");

        await registerpage.goToUrl(baseUrl);
        await registerpage.fillForm(user);
        let errormessage = await registerpage.getErrorMessageConfirmPassword();
        assert.equal(errormessage, "Not same password");
    });

    it("Should not have enough characters", async () => {
        let registerpage = new Registerpage(driver);
        let baseUrl = "https://localhost:8080/register";
        let user = new UserData(
            "Pipi",
            "Langstrumpf",
            "pipi",
            "pipi@gmail.com",
            "1234567",
            "12345678");

        await registerpage.goToUrl(baseUrl);
        await registerpage.fillForm(user);
        let errormessage = await registerpage.getErrorMessageNewPassword();
        assert.equal(errormessage, "Min. 8 characters");
    });

    after(async function() {
        await driver.quit();
    });


});

describe("Login Test for the login form", function() {
    let driver = null;


    before(async () => {
        driver = await new Builder().withCapabilities({acceptInsecureCerts: true})
            .forBrowser('firefox')
            .setFirefoxOptions(new firefox.Options().headless())
            .build();


    });



    it("should pop up the Loginmodal", async () => {
        let loginpage = new Loginpage(driver);
        await loginpage.openLoginModal();
        await loginpage.waitForModal();
        let title = await loginpage.getLoginModalTitle();
        assert.equal(title, "Login Form");

    });

    it("Login with wrong password", async () => {
        let loginpage = new Loginpage(driver);
        await loginpage.openLoginModal();
        await loginpage.fillUsernameField("clodos");
        await loginpage.clickLoginButton();
        let errormessage = await loginpage.getErrorMessage();
        assert.equal(errormessage, "Wrong Password");
    });

    it("Login with wrong Username", async () => {
        let loginpage = new Loginpage(driver);
        await loginpage.openLoginModal();
        await loginpage.fillUsernameField("");
        await loginpage.clickLoginButton();
        let errormessage = await loginpage.getErrorMessage();
        assert.equal(errormessage, "User not found");
    });

    after(async function() {
        await driver.quit();
    });

});
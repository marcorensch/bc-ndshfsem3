import * as dotenv from 'dotenv';

dotenv.config({path: '../server/.env'});

import * as assert from "assert";
import Homepage from "./pageobjects/homepage.mjs";
import Registerpage from "./pageobjects/registerpage.mjs";
import UserData from "./pageobjects/UserData.mjs";
import Loginpage from "./pageobjects/loginpage.mjs";
import {Builder} from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox.js";
import UserHelper from "../../server/helper/userHelper.mjs";
import User from "../../server/model/user.mjs";

const testDbConnectionData = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}
const userHelper = new UserHelper(testDbConnectionData);

describe("Tests if website is reachable", function () {
    let driver = null;
    before(async function () {
        try {
            driver = await new Builder().withCapabilities({acceptInsecureCerts: true})
                .forBrowser('firefox')
                .setFirefoxOptions(new firefox.Options().headless())
                .build();
        } catch (err) {
            console.log(err);
        }
    });

    it("On homepage find project titel in header", async () => {
        let homepage = new Homepage(driver);
        let baseUrl = "https://localhost:8080";
        await homepage.goToUrl(baseUrl);
        let homepageDisplayed = await homepage.waitForHomepage();
        if (homepageDisplayed) {
            let title = await homepage.getText(".header > h1:nth-child(1)")
            assert.equal(title, "Babylon Community");
        }
    });
    after(async function () {
        try {
            await driver.quit();
        } catch (err) {
            console.log(err);
        }
    });
});

describe("Register test for the signup form", function () {
    let driver = null;
    before(async function () {
        try {
            driver = await new Builder().withCapabilities({acceptInsecureCerts: true})
                .forBrowser('firefox')
                .setFirefoxOptions(new firefox.Options().headless())
                .build();
        } catch (err) {
            console.log(err);
        }
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
    after(async function () {
        try {
            await driver.quit();
        } catch (err) {
            console.log(err);
        }
    });
});

describe("Login test for the login form", function () {
    let driver = null;
    before(async () => {
        try {
            driver = await new Builder().withCapabilities({acceptInsecureCerts: true})
                .forBrowser('firefox')
                .setFirefoxOptions(new firefox.Options().headless())
                .build();
        } catch (err) {
            console.log(err)
        }
    });

    it("should pop up the loginmodal", async () => {
        let loginpage = new Loginpage(driver);

        await loginpage.openLoginModal();
        let modal = await loginpage.waitForModal();
        if (modal) {
            let title = await loginpage.getLoginModalTitle();
            assert.equal(title, "Login Form");
        }
    });

    it("Existing user login with wrong password", async () => {
        await userHelper.deleteUserByUsername("test-user");
        const user = new User("Test", "Test", "test-user", "testuser.test@gmail.com");
        user.setPassword("12345678");
        await userHelper.registerUser(user);
        let loginpage = new Loginpage(driver);

        await loginpage.openLoginModal();
        let modal = await loginpage.waitForModal();
        if (modal) {
            await loginpage.fillUsernameField("test-user");
            await loginpage.clickLoginButton();
            let errormessage = await loginpage.getErrorMessage();
            assert.equal(errormessage, "Wrong Password");
            await userHelper.deleteUserByUsername("test-user");
        }
    });

    it("Login with wrong Username", async () => {
        let loginpage = new Loginpage(driver);
        await loginpage.openLoginModal();
        let modal = await loginpage.waitForModal();
        if (modal) {
            await loginpage.fillUsernameField("no-user");
            await loginpage.clickLoginButton();
            let errormessage = await loginpage.getErrorMessage();
            assert.equal(errormessage, "User not found");
        }

    });

    it("Login with correct username and password", async () => {
        await userHelper.deleteUserByUsername("Ferdi");
        const user = new User("Ferdinand", "Maier", "Ferdi", "Ferdi.test@gmail.com");
        user.setPassword("12345678");
        await userHelper.registerUser(user);
        let loginpage = new Loginpage(driver);
        await loginpage.openLoginModal();
        let modal = await loginpage.waitForModal();
            if (modal) {
                await loginpage.fillUsernameField("Ferdi");
                await loginpage.fillPasswordField("12345678");
                await loginpage.clickLoginButton();
                let logoutBtnDisplayed = await loginpage.getLogoutButtonSidebar();
                assert.equal(logoutBtnDisplayed, true);
                await userHelper.deleteUserByUsername("Ferdi");
            }
    });
    after(async function () {
        try {
            await driver.quit();
        } catch (err) {
            console.log(err);
        }
    });
});
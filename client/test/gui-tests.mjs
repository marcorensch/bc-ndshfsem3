import * as assert from "assert";
import {expect} from "chai";
import Homepage from "../pageobjects/homepage.mjs";
import Registerpage from "../pageobjects/registerpage.mjs";
import UserData from "../pageobjects/UserData.mjs";

describe("Tests if website is reachable", function() {

    it("Homepage find project titel in header", async () => {
        let homepage = new Homepage();
        let baseUrl = "https://localhost:8080";
        let textFromSite = "";
        await homepage.goToUrl(baseUrl);
        textFromSite = await homepage.getText(".header > h1:nth-child(1)");
        assert.equal(textFromSite, "Babylon Community");
    });



});


describe("Register Test for the signup form", function() {


    it("Should not be a valid firstname", async () => {
        let registerpage = new Registerpage();
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
        let registerpage = new Registerpage();
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

    it("Should not be same password", async () => {
        let registerpage = new Registerpage();
        let baseUrl = "https://localhost:8080/register";
        let user = new UserData(
            "Pipi",
            "Langstrumpf!",
            "pipi",
            "pipi@gmail.com",
            "12345678",
            "12345678!");

        await registerpage.goToUrl(baseUrl);
        await registerpage.fillForm(user);
        let errormessage = await registerpage.getErrorMessagePassword();
        assert.equal(errormessage, "Not same password");
    });



});
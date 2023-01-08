import * as assert from "assert";
import {expect} from "chai";
import Homepage from "../pageobjects/homepage.mjs";

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
import {Builder, By, until,} from 'selenium-webdriver';
import firefox from "selenium-webdriver/firefox.js";

let driver = new Builder()
    .withCapabilities({acceptInsecureCerts: true})
    .forBrowser('firefox')
    .setFirefoxOptions(new firefox.Options().headless())
    .build();


class Basepage {
    constructor() {
        global.driver = driver;
    }

    async goToUrl(url) {
        await driver.get(url);
    }

    async closeWindow() {
        await driver.close();
    }
}

export default Basepage;
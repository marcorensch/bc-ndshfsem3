import {By, Key} from 'selenium-webdriver';


class Homepage {

    constructor(driver) {
        this.driver = driver;
    }

    async goToUrl(url) {
        await this.driver.get(url);
    }

    async getText(css_selector){
        return await this.driver.findElement(By.css(css_selector)).getText();
    }


}

export default Homepage;
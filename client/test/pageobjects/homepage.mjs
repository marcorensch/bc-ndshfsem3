import {By, until} from 'selenium-webdriver';

class Homepage {
    constructor(driver) {
        this.driver = driver;
    }
    async goToUrl(url) {
       await  this.driver.get(url);
    }
    async getText(css_selector){
        return await this.driver.findElement(By.css(css_selector)).getText();
    }
    async waitForHomepage(){
        return await this.driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div[1]/h1')), 30000).isDisplayed();
    }
}
export default Homepage;
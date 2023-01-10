import {By, Key, until, } from 'selenium-webdriver';


class Loginpage{

    constructor(driver) {
        this.driver = driver;
    }

    async openLoginModal(){
        await this.driver.get("https://localhost:8080/");
        await this.clickLoginButtonSidebar();


    }

    async waitForModal(){
       return  await this.driver.wait(until.elementLocated(By.xpath('/html/body/div[2]/div/div/div/h2')), 30000);
    }

    async clickLoginButtonSidebar(){
        return await this.driver.findElement(By.xpath('//*[@id="show-login-modal"]')).click();
    }

    async clickRegisterButton() {
        return await this.driver.findElement(By.xpath('/html/body/div[2]/div/div/form/div[2]/a')).click();

    }

    async getLoginModalTitle(){
        return await this.driver.findElement(By.xpath('/html/body/div[2]/div/div/div/h2')).getText();
    }

    async fillUsernameField(username) {
        await this.driver.findElement(By.xpath('//*[@id="username"]')).sendKeys(username);
    }

    async clickLoginButton() {
        return await this.driver.findElement(By.xpath('/html/body/div[2]/div/div/form/div[2]/button')).click();
    }
    async getErrorMessage(){
        return await this.driver.findElement(By.xpath('/html/body/div[2]/div/div/div[2]')).getText();
    }

}



export default Loginpage;
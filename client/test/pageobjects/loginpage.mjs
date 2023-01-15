import {By, Key, until, } from 'selenium-webdriver';


class Loginpage{

    constructor(driver) {
        this.driver = driver;
    }

    async openLoginModal(){

            await this.driver.get("https://localhost:8080/");
            let button = await this.getLoginButtonSidebar();
            button.click();

    }

    async waitForModal(){
       return await this.driver.wait(until.elementLocated(By.xpath('/html/body/div[2]/div/div/div/h2')), 30000).isDisplayed();
    }

    async getLoginButtonSidebar(){
        return await this.driver.findElement(By.xpath('//*[@id="show-login-modal"]'));
    }

    async getLogoutButtonSidebar(){
        return await this.driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div[2]/aside/div[5]/a')), 30000).isDisplayed();
    }


    async getLoginModalTitle(){
        return await this.driver.wait(until.elementLocated(By.xpath('/html/body/div[2]/div/div/div/h2')), 30000).getText();
    }

    async getUsernameField() {
        return await this.driver.findElement(By.xpath('//*[@id="username"]'));
    }

    async getPasswordField(){
        return await this.driver.findElement(By.xpath('//*[@id="password"]'));
    }

    async fillUsernameField(username) {
        let usernameField = await this.getUsernameField();
        usernameField.clear();
        return await usernameField.sendKeys(username);
    }

    async fillPasswordField(password) {
        let passwordField = await this.getPasswordField();
        passwordField.clear();
        return await passwordField.sendKeys(password);
    }

    async clickLoginButton() {
        return await this.driver.findElement(By.xpath('/html/body/div[2]/div/div/form/div[2]/div[2]/button')).click();
    }
    async getErrorMessage(){
        return await this.driver.findElement(By.xpath('/html/body/div[2]/div/div/div[2]')).getText();
    }

}



export default Loginpage;
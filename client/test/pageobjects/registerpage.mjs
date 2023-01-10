import {By, Key} from 'selenium-webdriver';



class Registerpage  {

    constructor(driver) {
        this.driver = driver;
    }


    async fillForm(user) {

        await this.getFirstNameField().sendKeys(user._firstname);
        await this.getLastNameField().sendKeys(user._lastname);
        await this.getUsernameField().sendKeys(user._username);
        await this.getEmailField().sendKeys(user._email);
        await this.getPasswordField().sendKeys(user._password);
        await this.getConfirmPasswordField().sendKeys(user._confirmPassword);
        await this.getRegisterButton().click();

    }

    async goToUrl(url) {
        this.driver.get(url);
    }



    async getMainErrorMessage(){
        return await this.driver.findElement(By.xpath('/html/body/div/div/div[2]/main/div/div/span')).getText();
    }

    async getErrorMessageConfirmPassword() {
        return await this.driver.findElement(By.xpath('/html/body/div/div/div[2]/main/div/form/div[1]/div[3]/div[2]/span')).getText();
    }
    async getErrorMessageNewPassword() {
        return await this.driver.findElement(By.xpath('/html/body/div/div/div[2]/main/div/form/div[1]/div[3]/div[1]/span')).getText();
    }

    async getErrorMessageEmail(){
        return await this.driver.findElement(By.xpath('/html/body/div/div/div[2]/main/div/form/div[1]/div[2]/div[1]/span')).getText();
    }


    getFirstNameField() {
        return this.driver.findElement(By.xpath('//*[@id="firstname"]'));
    }

    getLastNameField() {
        return this.driver.findElement(By.xpath('//*[@id="lastname"]'));
    }

    getUsernameField() {
        return this.driver.findElement(By.xpath('//*[@id="username"]'));
    }

    getEmailField() {
        return this.driver.findElement(By.xpath('//*[@id="email"]'));
    }


    getPasswordField() {
        return this.driver.findElement(By.xpath('//*[@id="new-password"]'));
    }

    getConfirmPasswordField() {
        return this.driver.findElement(By.xpath('//*[@id="confirm-password"]'));
    }

    getRegisterButton() {
      return this.driver.findElement(By.xpath('/html/body/div/div/div[2]/main/div/form/div[2]/button'));
    }


}

export default Registerpage;
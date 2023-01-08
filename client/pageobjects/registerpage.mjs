import {By, Key} from 'selenium-webdriver';
import Basepage from '../pageobjects/basepage.mjs';


class Registerpage extends Basepage {


    async fillForm(user) {

        await this.getFirstNameField().sendKeys(user._firstname);
        await this.getLastNameField().sendKeys(user._lastname);
        await this.getUsernameField().sendKeys(user._username);
        await this.getEmailField().sendKeys(user._email);
        await this.getPasswordField().sendKeys(user._password);
        await this.getConfirmPasswordField().sendKeys(user._confirmPassword);
        await this.getRegisterButton().click();

    }



    async getMainErrorMessage(){
        return await driver.findElement(By.xpath('/html/body/div/div/div[2]/main/div/div/span')).getText();
    }

    async getErrorMessagePassword() {
        return await driver.findElement(By.xpath('/html/body/div/div/div[2]/main/div/form/div[1]/div[3]/div[2]/span')).getText();
    }


    getFirstNameField() {
        return driver.findElement(By.xpath('//*[@id="firstname"]'));
    }

    getLastNameField() {
        return driver.findElement(By.xpath('//*[@id="lastname"]'));
    }

    getUsernameField() {
        return driver.findElement(By.xpath('//*[@id="username"]'));
    }

    getEmailField() {
        return driver.findElement(By.xpath('//*[@id="email"]'));
    }


    getPasswordField() {
        return driver.findElement(By.xpath('//*[@id="new-password"]'));
    }

    getConfirmPasswordField() {
        return driver.findElement(By.xpath('//*[@id="confirm-password"]'));
    }

    getRegisterButton() {
      return driver.findElement(By.xpath('/html/body/div/div/div[2]/main/div/form/div[2]/button'));
    }


}

export default Registerpage;
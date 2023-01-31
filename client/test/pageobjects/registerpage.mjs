import {By} from 'selenium-webdriver';
class Registerpage  {
    constructor(driver) {
        this.driver = driver;
    }
    async fillForm(user) {
        try{
            let firstname = await this.getFirstNameField();
            let lastname = await this.getLastNameField();
            let username = await this.getUsernameField();
            let email = await this.getEmailField();
            let password = await this.getPasswordField();
            let confirmPassword = await this.getConfirmPasswordField();
            let registerButton = await this.getRegisterButton();

            await firstname.sendKeys(user._firstname);
            await lastname.sendKeys(user._lastname);
            await username.sendKeys(user._username);
            await email.sendKeys(user._email);
            await password.sendKeys(user._password);
            await confirmPassword.sendKeys(user._confirmPassword);
            await registerButton.click();
        }catch (err) {
            console.log(err);
        }
    }
    async goToUrl(url) {
       await this.driver.get(url);
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
    async getFirstNameField() {
        return await this.driver.findElement(By.xpath('//*[@id="firstname"]'));
    }
    async getLastNameField() {
        return await this.driver.findElement(By.xpath('//*[@id="lastname"]'));
    }
    async getUsernameField() {
        return await this.driver.findElement(By.xpath('//*[@id="username"]'));
    }
    async getEmailField() {
        return await this.driver.findElement(By.xpath('//*[@id="email"]'));
    }
    async getPasswordField() {
        return await this.driver.findElement(By.xpath('//*[@id="new-password"]'));
    }
    async getConfirmPasswordField() {
        return await this.driver.findElement(By.xpath('//*[@id="confirm-password"]'));
    }
    async getRegisterButton() {
      return await this.driver.findElement(By.xpath('/html/body/div/div/div[2]/main/div/form/div[2]/button'));
    }
}
export default Registerpage;
import {By, Key} from 'selenium-webdriver';
import Basepage from './basepage.mjs';

class Homepage extends Basepage{

    async getText(css_selector){
        return await driver.findElement(By.css(css_selector)).getText();
    }


}

export default Homepage;
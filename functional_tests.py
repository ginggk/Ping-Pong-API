from selenium.webdriver import Firefox
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestLogin:
    def setup_method(self):
        options = Options()
        options.headless = True
        self.browser = Firefox(options=options)

    def teardown_method(self):
        self.browser.quit()

    def test_login_success(self):
        self.browser.get("http://localhost:5500/index.html")
        assert 'Log In' in self.browser.find_element_by_id("LoginLink").text

        loginButton = self.browser.find_element_by_id("LoginLink")
        loginButton.click()

        self.browser.find_element_by_id("existingUsername").send_keys(
            'ginggk2')
        self.browser.find_element_by_id("existingPassword").send_keys(
            "adamtutor")

        button = self.browser.find_element_by_id("loginButton")
        button.click()

        el = WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located((By.ID, 'welcomeUser')))

        assert "Welcome ginggk2!!" in el.text

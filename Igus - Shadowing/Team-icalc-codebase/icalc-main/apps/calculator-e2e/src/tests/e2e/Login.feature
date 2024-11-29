Feature: Login Page

  Scenario: iCalc should redirect unauthenticated users to login page
    Given an unauthenticated user
    When the user opens iCalc
    Then iCalc should open the login page

  Scenario: The user should be able to login
    Given the user is on login page
    When the user enters valid credentials
    Then iCalc should navigate to meta data page

  Scenario: The user should see an error message if a login attempt was not successful
    Given the user is on login page
    When the user enters invalid credentials
    Then iCalc should show an error message

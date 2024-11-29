Feature: Right Connector Page
  Scenario: item with outdated price in configuration
    Given the user is on rightConnector page with a Configuration selected that has updated mat017 item prices
    When the user selects a mat017 item with updated price as right connector item
    And accepts to copy the price from left connector
    And proceeds to next step
    Then iCalc should save the mat017 item with updated price for right connector

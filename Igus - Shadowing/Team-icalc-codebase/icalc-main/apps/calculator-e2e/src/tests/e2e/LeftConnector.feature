Feature: Left Connector Page

  Scenario: Show only manually created items
    Given the user is on leftConnector page with a Configuration selected that has manually created mat017 items
    When the user filters for only manually added items
    Then iCalc should show the applied filter for all connectors including unmatched
    And iCalc should display only manually created items

  Scenario: Delete manually created mat017 item
    Given the user is on leftConnector page with a Configuration selected that has manually created mat017 items
    When the user filters for only manually added items
    And the user clicks to delete mat017Item and confirms deletion
    Then iCalc should delete the manually created mat017 item

# TODO: Implement following:
  Scenario: Add mat017 item from results list to Configuration
  Scenario: Add mat017 item connector set to Configuration

Feature: Meta Data Page

  Scenario: Open existing Calculation from calculation search
    Given the user is on Meta Data page
    And a calculation that is basic was previously created
    When the user navigates to calculation search
    And the user searches for basic calculation
    And starts editing selected calculation
    Then iCalc should display data of basic calculation

  Scenario: Apply filters which don't match any calculation
    Given the user is on Meta Data page
    When the user navigates to calculation search
    And the user applies filters not matching any calculation
    Then iCalc should show an empty results list

  Scenario: Open existing calculation from configuration search
    Given the user is on Meta Data page
    When the user navigates to configuration search
    And the user searches for basic configuration
    And starts editing selected calculation
    Then iCalc should display data of basic calculation

  Scenario: Create new calculation and configuration
    Given the user is on Meta Data page
    When the user enters a new calculation and configuration number with according data
    And the user starts the calculation
    Then iCalc should create new calculation and configuration
    And iCalc should navigate to Chainflex page

  Scenario: Display data of selected calculation and configuration when navigating back to Meta Data page
    Given the user is on chainflex page with a Calculation selected that is basic
    When the user navigates back to meta data page
    Then iCalc should display data of Calculation selected that is basic

  Scenario: Assign new configuration to existing calculation
    Given the user is on metaData page with a Calculation selected that is basic
    When the user adds new configuration
    And the user starts the calculation
    Then new configuration should be added to calculation
    And iCalc should navigate to Chainflex page

  Scenario: Copy configuration without price updates to new calculation
    Given the user is on metaData page with a Configuration selected that has updated mat017 item prices
    When the user copy configuration with old prices to new calculation
    Then iCalc should display the copied configuration with old prices on meta data page

  Scenario: Copy configuration with price updates to new calculation
    Given the user is on metaData page with a Configuration selected that has updated mat017 item prices
    When the user copy configuration with current prices to new calculation
    Then iCalc should display the copied configuration with current prices on Meta Data page

  Scenario: Copy configuration from locked calculation and assign to new calculation
    Given the user is on metaData page with a Calculation selected that is locked
    When the user copy configuration from locked calculation to new calculation
    And iCalc should display the copied configuration from locked calculation on Meta Data page

  Scenario: Copy configuration to existing calculation
    Given the user is on metaData page with a Calculation selected that is basic
    When the user copy configuration to existing calculation
    Then iCalc should display the copied configuration to existing calculation on Meta Data page

  Scenario: Copy calculation and assign selected configurations
    Given the user is on metaData page with a Calculation selected that is locked
    When the user copy locked calculation with its configuration
    Then iCalc should save the copied calculation and assign the selected configuration

  Scenario: Remove assignment of configuration from calculation
    Given the user is on metaData page with a Calculation selected that has many assignments
    When the user removes selected assignment from Calculation
    Then iCalc should remove the Calculation and leave one assignment to the calculation

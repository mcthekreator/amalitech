Feature: Chainflex Page

  Scenario: Sort chainflex results descending by part number
    Given the user is on chainflex page with a Calculation selected that is basic
    When the user clicks to sort by part number
    Then iCalc should display the part number sort indicator
    And iCalc should sort the chainflex table descending by part number

  Scenario: Sort chainflex results ascending by part number
    Given the user is on chainflex page with a Calculation selected that is basic
    Then iCalc should display the part number sort indicator
    And iCalc should sort the chainflex table ascending by part number

  Scenario: Filter chainflex results by part number
    Given the user is on chainflex page with a Calculation selected that is basic
    When the user searches for a chainflex by part number
    Then iCalc should display the searched Chainflex as first result in the table

  Scenario: Select new chainflex and chainflex length
    Given the user is on chainflex page with a Calculation selected that is basic
    When the user selects a different chainflex
    And selects new chainflex length
    Then iCalc should save the newly selected chainflex and chainflex length

  Scenario: Display notification for chainflex price changes
    Given the user is on chainflex page with a Configuration selected that has updated chainflex price
    Then iCalc should show a notification box for changed chainflex prices

  Scenario: Display a notification for chainflex price removals
    Given the user is on chainflex page with a Configuration selected that has removed chainflex
    Then iCalc should show a notification box for removed chainflex prices

  Scenario: Confirmation for selection of different chainflex for price removals
    Given the user is on chainflex page with a Configuration selected that has removed chainflex
    When the user selects a different chainflex
    And clicks to confirm his selection in the removal warning dialog
    Then iCalc should display the newly selected chainflex part number
    And should not show the price removal notification

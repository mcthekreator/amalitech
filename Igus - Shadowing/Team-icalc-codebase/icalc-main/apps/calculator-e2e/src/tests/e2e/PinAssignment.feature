Feature: Pin Assignment Page

    Scenario: Validating a configuration on pin Assignment Page
        Given the user is on pinAssignment page with a Calculation selected that is basic
        And selects action setOnContact for core or shield
        When navigating to result page
        Then iCalc should trigger validation correctly
    
    Scenario: Show mat017 items in mat017-item-picker table
        Given the user is on pinAssignment page with a Calculation selected that is basic
        When the user selects MAT017 pin assignment option from actions
        And clicks on pick-mat017-item-button
        Then iCalc should show mat017-item-picker table
    
    Scenario: Add mat017 items as value of action
        Given the user is on pinAssignment page with a Calculation selected that is basic
        When the user selects MAT017 pin assignment option from actions
        And clicks on pick-mat017-item-button
        And selects mat017 item from mat017-item-picker table
        Then iCalc should show selected mat017 item as value for action in cable structure

    Scenario: Remove MAT017 item as MAT017 pin assignment option
        Given the user is on leftConnector page with a Configuration selected that has mat017 in pinAssignment
        When the user removes non-existing mat017 item from BOM and navigate to pinAssignment page
        Then iCalc should show no value for selected MAT017 pin assignment option

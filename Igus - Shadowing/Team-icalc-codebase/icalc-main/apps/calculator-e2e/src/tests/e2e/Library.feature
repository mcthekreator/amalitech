Feature: Library Page

  Scenario: Add predefined elements to sketch of active configuration
    Given the user is on library page with a Calculation selected that is basic
    When the user adds elements to the sketch
    And reopens the page
    Then iCalc should show the added elements at the right position

  Scenario: Add predefined elements to sketch of locked configuration
    Given the user is on library page with a Calculation selected that is locked
    When the user adds elements to the sketch
    And reopens the page
    Then iCalc should show the added elements at the right position

  Scenario: Upload external image to sketch of active configuration
    Given the user is on library page with a Calculation selected that is basic
    When the user adds an image to the sketch
    And reopens the page
    Then iCalc should show the added image

  Scenario: Upload Widen image for mat017 item without previous image
    Given the user is on library page with a Calculation selected that is basic
    When the user uploads an image to Widen
    And reopens the page
    Then iCalc should show the correct image in the tile of this item

  Scenario: Update Widen image for mat017 item
    Given the user is on library page with a Calculation selected that is basic
    When the user updates the Widen image for a mat017 item
    And reopens the page
    Then iCalc should show the correct image in the tile of this item

  Scenario: Update Widen image for mat017 item which is selected in more than one configuration
    Given the user is on library page with a Calculation selected that is basic
    When the user updates the Widen image for a mat017 item which is selected in more than one configuration
    And reopens the page
    Then iCalc should show the correct image in the tile of this item
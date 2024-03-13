Feature: Navigate to Github profile

  Scenario: Navigate to fonsecaj profile
    Given I am on the Github home page
    When I go to the "fonsecaj" page
    Then I should read "Jordan Fonseca" heading

  Scenario: Navigate to lexsonigo profile
    Given I am on the Github home page
    When I go to the "lexsonigo" page
    Then I should read "lexsonigo" heading

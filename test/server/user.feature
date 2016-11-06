Feature: user handling

  Scenario: user should be logged in after registration
    Given I register with "testuser1" and "123" password
     Then I should be logged in

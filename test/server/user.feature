Feature: user handling

  Scenario: user should be logged in after registration
    Given I register with "testuser1" and "123" password
     Then I should be logged in

  Scenario: decline registration with same username
    Given I register with "testuser1" and "123" password
     When I register with "testuser1" and "456" password
     Then I should get an error message "You are already registered" and status code "409"


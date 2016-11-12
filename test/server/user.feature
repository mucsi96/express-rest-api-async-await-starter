Feature: user handling

  Scenario: user should be logged in after registration
    Given I register with "testuser1" username and "123" password
     Then I should be logged in
      And the status code should be "201"

  Scenario: decline registration with same username
    Given I register with "testuser1" username and "123" password
     When I register with "testuser1" username and "456" password
     Then I should get an error message "You are already registered"
      And the status code should be "409"

  Scenario: user should be able to login
    Given I am a register user with "tom" username and "tompass" password
     When I login with "tom" username and "tompass" password
     Then I should be logged in
      And the status code should be "200"

  Scenario: decline login for not registered user
     When I login with "nonexistinguser" username and "123" password
     Then I should get an error message "Invalid credentials"
      And the status code should be "401"

  Scenario: decline login for with wrong password
    Given I am a register user with "tom" username and "tompass" password
     When I login with "tom" username and "wrongpass" password
     Then I should get an error message "Invalid credentials"
      And the status code should be "401"

  Scenario: decline private user info request without authorization token
     When I request private user info without authorization token
     Then I should get an error message "No authorization token was found"
      And the status code should be "401"

  Scenario: decline private user info request with wrong authorization token
     When I request private user info with wrong authorization token
     Then I should get an error message "invalid signature"
      And the status code should be "401"

  Scenario: providing private user info with correct authorization token
    Given I am logged in
     When I request private user info with correct authorization token
     Then I should get my user info
      And the status code should be "200"


$serial
Feature: History
  In order manage transactions
  As a user
  I want to get and update history
  
  Background:
    Given I have cleaned up
    And I have logged out
    And a user exists with auth token "1234567890"
    And I have the following transaction data
      | date     | amount | description            | category               |
      | 2/1/2012 | 12.45  | some cool purchase     | some cool categroy     |
      | 2/2/2012 | 13.45  | another cool purchase  | another cool categroy  |
      | 2/3/2012 | 14.45  | a third cool purchase  | a third cool categroy  |
      | 2/4/2012 | 15.45  | a fourth cool purchase | a fourth cool categroy |
    And the transaction data has been submitted

  Scenario: Get history
    When I authenticate with "1234567890"
    And I get the history
    Then I should get back the history with ids
  
  Scenario: Process transactions
    When I authenticate with "1234567890"
    And I get the history
    And I process transactions with the following dates
      | date     |
      | 2/1/2012 |
      | 2/3/2012 |
    And I get the history
    Then I should get back the following transactions
      | date     | amount | description            | category               |
      | 2/2/2012 | 13.45  | another cool purchase  | another cool categroy  |
      | 2/4/2012 | 15.45  | a fourth cool purchase | a fourth cool categroy |
$serial
Feature: Transaction
  In order to record individual finances
  As a user
  I want to add credit and debit transactions
  
  Background:
    Given I have cleaned up
    And I have logged out
    And a user exists with auth token "1234567890"
    And I have the following transaction data
      | date     | amount | description        | category           |
      | 2/1/2012 | 12.45  | some cool purchase | some cool categroy |

  Scenario: Success: Submit credit transaction
    When I authenticate
    And I submit the transaction
    Then I should get a successful response


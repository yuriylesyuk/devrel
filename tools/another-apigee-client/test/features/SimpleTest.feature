Feature: Test Cucumber-Shell

  Scenario:
    When I run echo "hello"
    Then the command shouldn't fail
    And stdout should contain hello

  Scenario:
    When I run touch hello && grep blah hello
    Then the command should fail

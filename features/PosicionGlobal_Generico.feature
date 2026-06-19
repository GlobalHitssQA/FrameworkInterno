Feature: Global Position

  @PruebaGeneradaIA @CP1
  Scenario: Verify global position page is displayed after valid login
    Given I login to BBVA with card "4152313980608892" and password "Lopez0101"
    Then the global position page should be displayed
    And the client alias should be visible
    And the account types cuenta en pesos and tarjeta de credito should be visible

  @PruebaGeneradaIA @CP2
  Scenario: Download balance PDF from global position using Imprimir saldos
    Given I login to BBVA with card "4152313980608892" and password "Lopez0101"
    When I click the Imprimir saldos link to download the balance PDF
    Then the balance PDF file should be downloaded successfully

  @PruebaGeneradaIA @CP3
  Scenario Outline: Verify movements fields and export options for peso account with <period> period
    Given I login to BBVA with card "4152313980608892" and password "Lopez0101"
    When I open the movements section for the peso account
    And I select the movements period "<period>"
    Then the movements period filter should display "<period>"
    And the movements table should show columns FECHA DESCRIPCION MONTO and SALDO TOTAL
    And the PDF Excel and print export options should be available

    Examples:
      | period          |
      | Mes Actual      |
      | Mes Anterior    |
      | Dos meses atrás |

  @PruebaGeneradaIA @CP4
  Scenario: Download movements in PDF Excel and print formats and verify account fields
    Given I login to BBVA with card "4152313980608892" and password "Lopez0101"
    When I open the movements section for the peso account
    And I select the movements period "Mes Actual"
    And the PDF Excel and print export options should be available
    And I download the movements as PDF
    And I download the movements as Excel
    And I print the movements
    Then the movements table should show columns FECHA DESCRIPCION MONTO and SALDO TOTAL
    And the movements PDF file should be downloaded successfully
    And the movements Excel file should be downloaded successfully

  @PruebaGeneradaIA @CP5
  Scenario Outline: Verify movements fields and export options for TDC account with <period> period
    Given I login to BBVA with card "4152313980608892" and password "Lopez0101"
    When I open the movements section for the TDC account
    And I select the movements period "<period>"
    Then the movements period filter should display "<period>"
    And the movements table should show columns FECHA DESCRIPCION MONTO and SALDO TOTAL
    And the PDF Excel and print export options should be available

    Examples:
      | period             |
      | Mes Actual         |
      | Mes Anterior       |
      | Dos meses atrás    |
      | Tres meses atrás   |
      | Cuatro meses atrás |
      | Cinco meses atrás  |

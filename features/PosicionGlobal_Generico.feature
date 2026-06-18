Feature: F - Posicion Global

  @PruebaGeneradaIA @CP2
  Scenario: Verify PDF is downloaded when clicking "Imprimir saldos" on the global position page
    Given I navigate to the BBVA login URL
    When I fill the card number "4152313980608892" in the login form
    And I fill the password "Lopez0101" in the login form
    And I submit the login form with token "11111111"
    And I click the "Imprimir saldos" link on the global position page
    Then a PDF file with the global position balance details should be downloaded

  @PruebaGeneradaIA @CP1
  Scenario: Verify global position is displayed after valid client login with card credentials
    Given I navigate to the BBVA online banking login page
    When I enter the card number "4152313980608892" and the password "Lopez0101"
    And I click the login button
    Then the global position page should be displayed
    And the debit account section should be visible
    And the credit card section should be visible

  @PruebaGeneradaIA @CP3
  Scenario Outline: Verify movements fields and download options for a peso account selecting <period>
    Given I navigate to the BBVA login URL
    When I fill the card number "4152313980608892" in the login form
    And I fill the password "Lopez0101" in the login form
    And I submit the login form with token "11111111"
    And I open the three-dot menu on the peso account card
    And I select "Movimientos" from the account card menu
    And I select the movements period "<period>"
    Then the movements table columns should be visible
    And the download options for movements should be available

    Examples:
      | period          |
      | Mes Actual      |
      | Mes Anterior    |
      | Dos meses atrás |

  @PruebaGeneradaIA @CP4
  Scenario: Verify movements export options PDF, Excel and Print are available and fields are displayed
    Given I navigate to the BBVA login URL
    When I fill the card number "4152313980608892" in the login form
    And I fill the password "Lopez0101" in the login form
    And I submit the login form with token "11111111"
    And I open the three-dot menu on the peso account card
    And I select "Movimientos" from the account card menu
    And I select the movements period "Mes Anterior"
    Then the movements table columns should be visible
    And the movements export options should be available

  @PruebaGeneradaIA @CP5
  Scenario Outline: Verify TDC credit card movements columns and export options for period <period>
    Given I navigate to the BBVA login URL
    When I fill the card number "4152313980608892" in the login form
    And I fill the password "Lopez0101" in the login form
    And I submit the login form with token "11111111"
    And I open the three-dot menu on the credit card TDC card
    And I select "Movimientos" from the credit card menu
    And I select the TDC movements period "<period>"
    Then the TDC movements columns Fecha Descripcion Importe and Saldo should be configured
    And the TDC movements export options PDF Excel and Print should be available

    Examples:
      | period             |
      | Mes actual         |
      | Mes anterior       |
      | Dos meses atrás    |
      | Tres meses atrás   |
      | Cuatro meses atrás |
      | Cinco meses atrás  |

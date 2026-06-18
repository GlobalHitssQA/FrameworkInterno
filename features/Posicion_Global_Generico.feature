Feature: F - Posicion Global

  @PruebaGeneradaIA @CP1
  Scenario: Verify global position page is displayed after valid login
    Given I navigate to the BBVA Mexico login page
    When I enter card number "4152313980608892" and password "Lopez0101"
    And I click the Continuar button
    Then the global position page should be displayed
    And the accounts section should show "Cuenta en Pesos"
    And the accounts section should show "Tarjetas de crédito"
    And the accounts section should show "Otros créditos"

  @PruebaGeneradaIA @CP2
  Scenario: Verify PDF is downloaded when clicking Imprimir saldos on global position page
    Given I navigate to the BBVA Mexico login page
    When I enter card number "4152313980608892" and password "Lopez0101"
    And I click the Continuar button
    And I enter the token "11111111"
    And I click the Continuar button after token
    And I click the Imprimir saldos link
    Then the PDF file should be downloaded successfully

  @PruebaGeneradaIA @CP3
  Scenario Outline: Verify movements columns and download options are displayed for <period> on peso account
    Given I navigate to the BBVA Mexico login page
    When I enter card number "4152313980608892" and password "Lopez0101"
    And I click the Continuar button
    And I enter the token "11111111"
    And I click the Continuar button after token
    And I click the three dots on the peso account card
    And I click the Movimientos option
    And I select the movements period "<period>"
    Then the movements columns Fecha Descripcion Importe and Saldo should be visible
    And the movements download options PDF Excel and Impresion should be available

    Examples:
      | period          |
      | Mes Actual      |
      | Mes Anterior    |
      | Dos meses atrás |

  @PruebaGeneradaIA @CP4
  Scenario Outline: Verify movements download in <format> format shows Fecha Descripcion Importe and Saldo columns
    Given I navigate to the BBVA Mexico login page
    When I enter card number "4152313980608892" and password "Lopez0101"
    And I click the Continuar button
    And I enter the token "11111111"
    And I click the Continuar button after token
    And I click the three dots on the peso account card
    And I click the Movimientos option
    And I select the movements period "Mes Actual"
    Then the movements columns Fecha Descripcion Importe and Saldo should be visible
    When I download the movements report in "<format>" format
    Then the movements report download should be initiated successfully

    Examples:
      | format    |
      | PDF       |
      | Excel     |
      | Impresión |

  @PruebaGeneradaIA @CP5
  Scenario Outline: Verify movements columns and download options are displayed for <period> on TDC account card
    Given I navigate to the BBVA Mexico login page
    When I enter card number "4152313980608892" and password "Lopez0101"
    And I click the Continuar button
    And I enter the token "11111111"
    And I click the Continuar button after token
    And I click the three dots on the TDC account card
    And I click the Movimientos option
    And I select the movements period "<period>"
    Then the movements columns Fecha Descripcion Importe and Saldo should be visible
    And the movements download options PDF Excel and Impresion should be available

    Examples:
      | period             |
      | Mes Actual         |
      | Mes Anterior       |
      | Dos meses atrás    |
      | Tres meses atrás   |
      | Cuatro meses atrás |
      | Cinco meses atrás  |

Feature: F - Posicion Global Generico

  @PruebaGeneradaIA @CP1
  Scenario: Verify global position is displayed after valid credentials login
    Given I am on the BBVA login page
    When I enter card number "4152313980608892" and password "Lopez0101"
    And I click the login button
    Then the global position page should be displayed with the client alias
    And the debit account and credit card sections should be visible

  @PruebaGeneradaIA @CP2
  Scenario: Verify PDF is downloaded after clicking Imprimir saldos in global position
    Given I am on the BBVA login page
    When I enter card number "4152313980608892" and password "Lopez0101"
    And I click the login button
    And I click on the "Imprimir saldos" link in global position
    Then a PDF file should be downloaded from the global position page

  @PruebaGeneradaIA @CP3
  Scenario Outline: Verify movement table fields and download options for pesos account by period
    Given I am on the BBVA login page
    When I enter card number "4152313980608892" and password "Lopez0101"
    And I click the login button
    And I open movements for the pesos account from the three-dot menu
    And I select the movement period "<period>"
    Then the movements table columns "FECHA", "DESCRIPCIÓN", "MONTO" and "SALDO TOTAL" should be visible
    And the download options section should be present in the movements page

    Examples:
      | period          |
      | Mes Actual      |
      | Mes Anterior    |
      | Dos meses atrás |

  @PruebaGeneradaIA @CP4
  Scenario Outline: Download movements in <format> format and verify movement fields
    Given I am on the BBVA login page
    When I enter card number "4152313980608892" and password "Lopez0101"
    And I click the login button
    And I open movements for the pesos account from the three-dot menu
    And I select the movement period "Mes Anterior"
    And I download the movements in "<format>" format
    Then the movements table columns "FECHA", "DESCRIPCIÓN", "MONTO" and "SALDO TOTAL" should be visible

    Examples:
      | format    |
      | PDF       |
      | Excel     |
      | Impresión |

  @PruebaGeneradaIA @CP5
  Scenario Outline: Verify TDC card movements section displays for each period
    Given I am on the BBVA login page
    When I enter card number "4152313980608892" and password "Lopez0101"
    And I click the login button
    And I open movements for the TDC card from the three-dot menu
    And I select the TDC credit card movement period "<period>"
    Then the TDC movements section should be visible with period "<period>" selected
    And the TDC movements download options components should be present

    Examples:
      | period             |
      | Mes actual         |
      | Mes anterior       |
      | Dos meses atrás    |
      | Tres meses atrás   |
      | Cuatro meses atrás |
      | Cinco meses atrás  |

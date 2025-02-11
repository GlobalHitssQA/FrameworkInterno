Feature: Registro de citas

  @probando
  Scenario Outline: Login with credentials
    #Im logged in as "Banca Privada" es el paso ejemplo para usar el autologin
    Given Im logged in
    And I select the contact
    And I should create the appointment with <Name> , <Surname> , <Phone> , <Email> , <Date> , <Time>
    Examples:
      | Name               | Surname              | Phone                                       | Email              | Date | Time |
      | {{internet.email}} | {{person.firstName}} | {{phone.number('+52-55-##-##-##-##')}} | {{internet.email}} | algo | algo |

  Scenario: ejemplo de uso de descarga de pdf
        Given Im logged in as "Banca Patrimonial"
        When I download pdf
        Then I validate pdf
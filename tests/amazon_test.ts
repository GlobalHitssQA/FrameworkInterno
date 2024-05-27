Feature("Prueba de carrito de compras de Amazon")

const xlsx = require('xlsx')
const filePath = './tests/data.xlsx'
const listaDeCompras: string[] = []; //Defino el arreglo para poder agregar los productos a la lista 

Scenario("Leer lista de compras de un Excel", async()=>{
    const workbook = xlsx.readFile(filePath)
    const sheetName = workbook.SheetNames[0]   
    const sheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 })
    const columnIndex = 0
    data.forEach(row => {
        listaDeCompras.push(row[columnIndex]);  //Agregar producto a la lista
      })
})

Scenario("Agregar producto a carrito", async({I})=>{
  I.amOnPage("https://www.amazon.com.mx/")
  I.wait(20) //Esperar a resolver captcha
  listaDeCompras.forEach(producto=>{
    if( I.waitForElement('#twotabsearchtextbox', 5) !== null){
        I.fillField("#twotabsearchtextbox", producto)
        I.click("#nav-search-submit-button")
        I.waitForElement("//div[@data-csa-c-pos='1']/span/div/div/div[2]", 10)
        I.click("//div[@data-csa-c-pos='1']/span/div/div/div[2]")
        I.waitForElement("#a-autoid-0", 10)
        I.click("#a-autoid-0")
        I.click("#quantity_1") //Selecciona la cantidad de productos
        I.click("#add-to-cart-button")
      }
  })
})

Scenario("Guardar subtotal en Excel", async({I})=>{
    I.waitForElement("#nav-cart-count-container", 3)
    I.click("#nav-cart-count-container")
    I.grabTextFrom("//span[@id='sc-subtotal-amount-buybox']/span").then(subtotal=>{
        const workbook = xlsx.readFile(filePath)
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        worksheet['A1'] = { v: "Subtotal:"+subtotal}
        xlsx.writeFile(workbook, filePath)
    })
})




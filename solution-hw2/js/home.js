const glazingPrices = {
  "keepOriginal": 0.00,
  "sugarMilk": 0.00,
  "vanillaMilk": 0.50,
  "doubleChocolate": 1.50
}

const basePrices = {
  "original": 2.49,
  "apple": 3.49,
  "raisin": 2.99,
  "walnut": 3.49,
  "chocolate": 3.99,
  "strawberry": 3.99
}

const packSizeOptions = {
  "onePack": 1,
  "threePack": 3,
  "sixPack": 5,
  "twelvePack": 10
}

class Roll {
  constructor(type, glazing, packSize) {
    // types can be "original", "apple", "raisin", "walnut", "chocolate", or "strawberry"
    this.type = type;
    // glazing can be "keepOriginal", "sugarMilk", "vanillaMilk", "doubleChocolate"
    this.glazing = glazing;
    // packSize can be "onePack", "threePack", "sixPack", or "twelvePack"
    this.packSize = packSize;
    // calculates price 
    this.price = (basePrices[this.type] + glazingPrices[this.glazing]) * packSizeOptions[this.packSize];
  }
}

/* 
  Returns a Roll object based on the type, glazing choice, and pack size choice pulled from
  the DOM. Accepts a rollType parameter that can be "original", "apple", "raisin", "walnut", 
  "chocolate", or "strawberry" to determine which cart element we are working with.
*/
function getFormData(rollType) {
  // Pulls data from the roll-specific form element
  let productForm = document.querySelector("#form-" + rollType);
  let data = new FormData(productForm);

  // Creates a new Roll object which calculates prices
  let type = rollType;
  let glazing = data.get(rollType + "-glaze");
  let packSize = data.get(rollType + "-pack");
  let newRoll = new Roll(type, glazing, packSize)

  console.log(newRoll);

  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  // Updates span displaying the cart price
  document.getElementById(rollType + "-price").innerHTML = formatter.format(newRoll.price);
  return newRoll;
}

function addToCart(type) {
  getFormData(type);

}

function formChange(type) {
  let updatedPrice = getFormData(type).price;
  console.log(updatedPrice);
}


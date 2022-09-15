// TODO: Combine glazingPrices and glazingNames into 1 object
const glazingPrices = {
  "keepOriginal": 0.00,
  "sugarMilk": 0.00,
  "vanillaMilk": 0.50,
  "doubleChocolate": 1.50,
}

const glazingNames = {
  "keepOriginal": "Keep original",
  "sugarMilk": "Sugar milk",
  "vanillaMilk": "Vanilla milk",
  "doubleChocolate": "Double chocolate",
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

// Formats numbers into currency
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

let cart = [];

// Populates glaze values
const glazeSelects = document.querySelectorAll('.select-glaze');
for (const selectElement of glazeSelects) {
  for (glazeType in glazingNames) {
    let selectOption = document.createElement('option');
    selectOption.value = glazeType;
    selectOption.innerHTML = glazingNames[glazeType];
    selectElement.appendChild(selectOption);
  }
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

  return newRoll;
}

function addToCart(type) {
  cart.push(getFormData(type));
  updateCartTag();
  console.log(cart);
}

function formChange(type) {
  let updatedPrice = getFormData(type).price;

  // Updates span displaying the cart price
  document.getElementById(type + "-price").innerHTML = formatter.format(updatedPrice);
}

function updateCartTag() {
  let totalPrice = cart.reduce((sum, object) => {
    return sum + object.price;
  }, 0);

  if (cart.length == 0 || cart.length > 1) {
    document.getElementById("cart-count").innerHTML = cart.length + " items";
  } else {
    document.getElementById("cart-count").innerHTML = cart.length + " item";
  }
  document.getElementById("cart-price").innerHTML = "Total: " + formatter.format(totalPrice);
}
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

//TODO: Combine with rollNames 
const basePrices = {
  "original": 2.49,
  "apple": 3.49,
  "raisin": 2.99,
  "walnut": 3.49,
  "chocolate": 3.99,
  "strawberry": 3.99
}

const rollNames = {
  "original": "Original cinnamon roll",
  "apple": "Apple cinnamon roll",
  "raisin": "Raisin cinnamon roll",
  "walnut": "Walnut cinnamon roll",
  "chocolate": "Double-chocolate cinnamon roll",
  "strawberry": "Strawberry cinnamon roll"
}

//TODO: Combine with packSizeListing
const packSizeOptions = {
  "onePack": 1,
  "threePack": 3,
  "sixPack": 5,
  "twelvePack": 10
}

const packSizeListing = {
  "onePack": 1,
  "threePack": 3,
  "sixPack": 6,
  "twelvePack": 12
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

  return newRoll;
}

function formChange(type) {
  let updatedPrice = getFormData(type).price;

  // Updates span displaying the cart price
  document.getElementById(type + "-price").innerHTML = formatter.format(updatedPrice);
}

function updateCartTag() {
  // Sum of object property code block adapted from 
  // https://bobbyhadz.com/blog/javascript-get-sum-of-array-object-values 
  let totalPrice = cart.reduce((sum, roll) => {
    return sum + roll.price;
  }, 0);

  if (cart.length == 0 || cart.length > 1) {
    document.getElementById("cart-count").innerHTML = cart.length + " items";
  } else {
    document.getElementById("cart-count").innerHTML = cart.length + " item";
  }
  document.getElementById("cart-price").innerHTML = "Total: " + formatter.format(totalPrice);
}

/*
  Displays the information of a roll in a pop-up
*/
function openCartPopup(roll) {
  document.getElementById("cart-popup").style.display = "block";
  setTimeout(closePopup, 3000);
  document.getElementById("cart-roll-name").innerHTML = rollNames[roll.type];
  document.getElementById("cart-glaze-name").innerHTML = glazingNames[roll.glazing];
  document.getElementById("cart-pack-size").innerHTML = 'Pack of ' + packSizeListing[roll.packSize];
  document.getElementById("cart-pack-price").innerHTML = 'Price: ' + formatter.format(roll.price);
}

/*
  Close Cart Popup
*/
function closePopup() {
  document.getElementById("cart-popup").style.display = "none";
}

/*
  Retrieves a Roll object from getFormData() and adds it to a cart array
  Calls the updateCartTag function to update text in header
*/
function addToCart(type) {
  let roll = getFormData(type)
  cart.push(roll);
  openCartPopup(roll);
  updateCartTag();
}
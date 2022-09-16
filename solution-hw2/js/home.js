const glazing = {
  "keepOriginal": {
    price: 0.00,
    displayName: "Keep original"
  },
  "sugarMilk": {
    price: 0.00,
    displayName: "Sugar milk"
  },
  "vanillaMilk": {
    price: 0.50,
    displayName: "Vanilla milk"
  },
  "doubleChocolate": {
    price: 1.50,
    displayName: "Double chocolate"
  }
}

const rolls = {
  "original": {
    basePrice: 2.49,
    displayName: "Original cinnamon roll"
  },
  "apple": {
    basePrice: 3.49,
    displayName: "Apple cinnamon roll"
  },
  "raisin": {
    basePrice: 2.99,
    displayName: "Raisin cinnamon roll"
  },
  "walnut": {
    basePrice: 3.49,
    displayName: "Walnut cinnamon roll"
  },
  "chocolate": {
    basePrice: 3.99,
    displayName: "Double-chocolate cinnamon roll"
  },
  "strawberry": {
    basePrice: 3.99,
    displayName: "Strawberry cinnamon roll"
  }
}

const pack = {
  "onePack": {
    priceMultiplier: 1,
    displayNumber: 1
  },
  "threePack": {
    priceMultiplier: 3,
    displayNumber: 3
  },
  "sixPack": {
    priceMultiplier: 5,
    displayNumber: 6
  },
  "twelvePack": {
    priceMultiplier: 10,
    displayNumber: 12
  }
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
  for (glazeType in glazing) {
    let selectOption = document.createElement('option');
    selectOption.value = glazeType;
    selectOption.innerHTML = glazing[glazeType].displayName;
    selectElement.appendChild(selectOption);
  }
}

class Roll {
  constructor(type, glaze, packSize) {
    // types can be "original", "apple", "raisin", "walnut", "chocolate", or "strawberry"
    this.type = type;
    // glazing can be "keepOriginal", "sugarMilk", "vanillaMilk", "doubleChocolate"
    this.glaze = glaze;
    // packSize can be "onePack", "threePack", "sixPack", or "twelvePack"
    this.packSize = packSize;
    // calculates price 
    this.price = (rolls[this.type].basePrice + glazing[this.glaze].price) * pack[this.packSize].priceMultiplier;
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
  document.getElementById("cart-roll-name").innerHTML = rolls[roll.type].displayName;
  document.getElementById("cart-glaze-name").innerHTML = glazing[roll.glaze].displayName;
  document.getElementById("cart-pack-size").innerHTML = 'Pack of ' + pack[roll.packSize].displayNumber;
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
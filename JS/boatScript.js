let boat = "";
let date = "";
let time = "";

if (window.XMLHttpRequest) {
  xmlhttp = new XMLHttpRequest();
} else {
  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.open("GET", "boat.xml", false);
xmlhttp.send();
xmlDoc = xmlhttp.responseXML;

class Seat {
  constructor(boat, seatID, price, booked) {
    this.boat = boat;
    this.seatID = seatID;
    this.price = price;
    this.booked = booked;
  }
}

class Food {
  constructor(foodName, foodPrice, foodInfo) {
    this.foodName = foodName;
    this.foodPrice = foodPrice;
    this.foodInfo = foodInfo;
  }
}

seatsArray = [];
foodArray = [];

function loadMenu() {
  let menu = xmlDoc.getElementsByTagName("menu");
  let food = menu[0].getElementsByTagName("food");
  for (i = 0; i < food.length; i++) {
    newFood = document.createElement("div");
    foodID = "food" + i;
    newFood.id = foodID;
    newFood.className = "food";
    foodName = food[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;

    price = food[i].getElementsByTagName("price")[0].childNodes[0].nodeValue;
    info = food[i].getElementsByTagName("info")[0].childNodes[0].nodeValue;
    fImage = food[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;
    document.getElementById("menuContainer").appendChild(newFood);
    foodContainer = document.getElementById(foodID);
    //create title of food
    let foodHeader = document.createElement("h1");
    let headerText = document.createTextNode(foodName);
    foodHeader.appendChild(headerText);
    foodContainer.appendChild(foodHeader);
    //create image for food
    let foodImage = document.createElement("img");
    foodImage.src = fImage;
    foodImage.alt = foodName;
    foodImageID = "image" + i;
    foodImage.id = foodImageID;
    foodImage.class = food;
    foodImage.height = 200;
    foodImage.width = 300;
    foodContainer.appendChild(foodImage);

    //create paragraphc for price
    let paragraph2 = document.createElement("p");
    let priceText = document.createTextNode("Price: $" + price + ".00");
    paragraph2.appendChild(priceText);
    foodContainer.appendChild(paragraph2);
    //create paragraph for food info
    let paragraph = document.createElement("p");
    let infoText = document.createTextNode("Alergens: " + info);
    paragraph.appendChild(infoText);
    foodContainer.appendChild(paragraph);
    //create numberpicker
    let foodButton = document.createElement("button");
    buttonID = "foodButton" + i;
    foodButton.className = "foodButton";
    foodButton.id = buttonID;
    let buttonText = document.createTextNode("Add to Cart");
    foodButton.appendChild(buttonText);
    foodContainer.appendChild(foodButton);
    //create add to cart button
    foodArray.push(new Food(foodName, price, info));
  }
  console.log(foodArray);
}

function loadTere() {
  seatsArray = [];
  let tere = xmlDoc.getElementsByTagName("tere");
  let tereDiv = document.createElement("div");
  tereDiv.id = "tereBoat";
  document.getElementById("boatContainer").appendChild(tereDiv);
  let rows = tere[0].getElementsByTagName("row");
  let count = 0;
  for (i = 0; i < rows.length; i++) {
    newrow = document.createElement("div");
    rowNo = i + 1;
    rowID = "row" + rowNo;
    newrow.id = rowID;
    newrow.className = "row";
    document.getElementById("tereBoat").appendChild(newrow);
    price = rows[i].getElementsByTagName("price")[0].childNodes[0].nodeValue;
    seats = rows[i].getElementsByTagName("seats")[0].childNodes[0].nodeValue;
    for (j = 0; j < seats; j++) {
      let middle = seats / 2 + 1;
      if (j == middle) {
        newSeat.style.marginLeft = "50px";
      }
      newSeat = document.createElement("div");
      newSeat.classList.add("seat");
      boatName = "tere";
      newSeat.id = count;
      seatsArray.push(new Seat(boatName, count, price, false));
      document.getElementById(rowID).appendChild(newSeat);
      count++;
    }
  }
}

function loadNui() {
  seatsArray = [];
  let nui = xmlDoc.getElementsByTagName("nui");
  let nuiDiv = document.createElement("div");
  nuiDiv.id = "nuiBoat";
  document.getElementById("boatContainer").appendChild(nuiDiv);
  let rows = nui[0].getElementsByTagName("row");
  let count = 0;
  for (i = 0; i < rows.length; i++) {
    newrow = document.createElement("div");
    rowNo = i + 1;
    rowID = "row" + rowNo;
    newrow.id = rowID;
    newrow.className = "row";
    document.getElementById("nuiBoat").appendChild(newrow);
    price = rows[i].getElementsByTagName("price")[0].childNodes[0].nodeValue;
    seats = rows[i].getElementsByTagName("seats")[0].childNodes[0].nodeValue;
    for (j = 0; j < seats; j++) {
      let middle = seats / 2 + 1;
      if (j == middle) {
        newSeat.style.marginLeft = "50px";
      }
      newSeat = document.createElement("div");
      newSeat.classList.add("seat");
      newSeat.id = count;
      boatName = "nui";
      seatsArray.push(new Seat(boatName, count, price, false));
      document.getElementById(rowID).appendChild(newSeat);
      count++;
    }
  }
}

selectedSeats = [];
let allSeats = document.getElementsByClassName("seat");

function selectSeat() {
  for (i = 0; i < allSeats.length; i++) {
    allSeats[i].addEventListener("click", function (e) {
      if (
        e.currentTarget.classList.contains("seat") &&
        !e.currentTarget.classList.contains("selected") &&
        !e.currentTarget.classList.contains("booked")
      ) {
        e.currentTarget.classList.toggle("selected");
        let selectedSeat = e.currentTarget.id;
        selectedSeats.push(selectedSeat);
        console.log("sel" + selectedSeats);

        getPrice();
      } else if (
        e.currentTarget.classList.contains("selected") &&
        !e.currentTarget.classList.contains("booked")
      ) {
        e.currentTarget.classList.remove("selected");

        let seatID2 = e.currentTarget.id;
        let myIndex = selectedSeats.indexOf(seatID2);
        if (myIndex !== -1) {
          selectedSeats.splice(myIndex, 1);
        }
        getPrice();
        console.log("sel" + selectedSeats);
      }

      ///add it to array get price and seat id
    });
  }
}
///all the seats

let confirmedSeats = [];
let bookedTime = "";
let bookedDate = "";
let bookedBoat = "";

function confirmSeats() {
  for (i = 0; i < selectedSeats.length; i++) {
    confirmedSeats.push(selectedSeats[i]);

    for (j = 0; j < allSeats.length; j++) {
      if (allSeats[j].classList.contains("selected")) {
        allSeats[j].classList.toggle("confirmed");
        allSeats[j].classList.remove("selected");
      }
    }
  }
  document.getElementById("menuContainer").scrollIntoView();
  ///getConfirmedPrice();
  bookedTime = time;
  bookedDate = date;
  bookedBoat = boat;
  console.log("Confirmed Seats:" + confirmedSeats);
  console.log(bookedDate);
  console.log(bookedBoat);
}

function markAsBooked() {
  console.log(date);
  let newSeats = [];
  if (bookedTime == time && bookedDate == date && bookedBoat == boat) {
    for (i = 0; i < allSeats.length; i++) {
      newSeats.push([i]);
      for (j = 0; j < confirmedSeats.length; j++) {
        if (newSeats[i] == confirmedSeats[j]) {
          allSeats[i].classList.toggle("confirmed");
        }
      }
    }
  }
}
///gets the price of each selected seat and adds them together
let finalSeatPrice = "";
function getPrice() {
  let totalPrice = 0;
  for (i = 0; i < selectedSeats.length; i++) {
    let value = selectedSeats[i];
    let seatPrice = seatsArray[value].price;
    totalPrice = Number(totalPrice) + Number(seatPrice);
  }

  let textPrice = document.getElementById("totalPrice");
  textPrice.value = "$" + totalPrice + ".00";
  let textSeats = document.getElementById("totalSeats");
  textSeats.value = selectedSeats;
  finalSeatPrice = totalPrice;
}

///fills in booked seats in random locations
///then will put previously booked seats in
function randomBooking() {
  for (i = 0; i < 20; i++) {
    allSeats[Math.floor(Math.random() * allSeats.length)].classList.toggle(
      "booked"
    );
  }
  markAsBooked();
}

///removes the boat ui on back button
function removeBoats() {
  if (boat == "tere") {
    let tere = document.getElementById("tereBoat");
    tere.parentNode.removeChild(tere);
  } else {
    let nui = document.getElementById("nuiBoat");
    nui.parentNode.removeChild(nui);
  }
}

/// function to populate food list

function displayPageOne() {
  page1.style.display = "block";
  loadMenu();
  addToCart();
}

function backButton() {
  selectedSeats = [];
  removeBoats();

  console.log(confirmedSeats);
  let textPrice = document.getElementById("totalPrice");
  textPrice.value = "";
  let textSeats = document.getElementById("totalSeats");
  textSeats.value = "";
}

function displayPageTwo() {
  let boatSelected = document.getElementById("boatSelect");
  let boatText = boatSelected.options[boatSelect.selectedIndex].text;

  let timeSelected = document.getElementById("timeSelect");
  let timeText = timeSelected.options[timeSelect.selectedIndex].text;

  let dateSelected = document.getElementById("bookingDate");
  let dateText = dateSelected.value;

  if (dateText == "") {
    alert("Please Select a Date!", true);
  } else {
    if (boatText == "Tere Boat") {
      loadTere();
      boat = "tere";
    } else {
      loadNui();
      boat = "nui";
    }
    time = timeText;
    date = dateText;
    console.log(date);
    console.log(time);
    randomBooking();
    selectSeat();
  }
}
let allFoodButtons = document.getElementsByClassName("foodButton");

function addToCart() {
  for (i = 0; i < allFoodButtons.length; i++) {
    allFoodButtons[i].addEventListener("click", function (e) {
      let selectedFood = e.currentTarget.id;
      let foodID = selectedFood.replace(/\D/g, "");

      displayCart(foodID);
      removeFromCart();

      ///add it to array get price and seat id
    });
  }
}

let allCartButtons = document.getElementsByClassName("cartButton");

function removeFromCart() {
  for (i = 0; i < allCartButtons.length; i++) {
    allCartButtons[i].addEventListener("click", function (e) {
      console.log("click");
      let button = e.currentTarget.id;
      let ID = button.replace(/\D/g, "");
      let cartRow = "row" + ID;
      removeRow(cartRow, ID);

      ///add it to array get price and seat id
    });
  }
}

function removeRow(cartRow, ID) {
  if (allCartButtons.length > 0) {
    let cart = document.getElementById(cartRow);
    cart.parentNode.removeChild(cart);

    const newArray = cartItems.filter(function (x) {
      return x !== ID;
    });

    cartItems = [];
    cartItems = newArray;

    updateCartPrice();
  }
}

let cartItems = [];
function displayCart(foodID) {
  console.log(foodID);
  console.log(cartItems);

  if (cartItems.indexOf(foodID) == -1) {
    newCartItem(foodID);
  } else {
    let newQuantity = document.getElementById("quantity" + foodID);
    let oldValue = newQuantity.value;
    let newValue = Number(oldValue) + 1;
    newQuantity.value = newValue;
    cartItems.push(foodID);
    updateCartPrice();
  }
}

///gets the letiables

function newCartItem(foodID) {
  let container = document.getElementById("rowContainer");
  let value = foodID;
  let foodName = foodArray[value].foodName;
  let foodPrice = foodArray[value].foodPrice;
  ///creates a new div
  let newRow = document.createElement("div");
  newRow.className = "cartRow";
  newRow.id = "row" + foodID;
  container.appendChild(newRow);
  /// text that displays food name
  let p1 = document.createElement("p");
  let foodText = document.createTextNode(foodName);
  p1.classname = "cartName";
  p1.appendChild(foodText);
  newRow.appendChild(p1);
  /// text that displays food price
  let p2 = document.createElement("p");
  let priceText = document.createTextNode("$" + foodPrice);
  p2.className = "cartPrice";
  p2.appendChild(priceText);
  newRow.appendChild(p2);
  /// number picker for the input
  let quantity = document.createElement("input");
  quantity.type = "number";
  quantity.value = 1;
  quantity.id = "quantity" + foodID;
  quantity.className = "cartQuantity";
  newRow.appendChild(quantity);
  /// displays remove button
  let cartButton = document.createElement("button");
  buttonID = "cartButton" + foodID;
  cartButton.id = buttonID;
  cartButton.className = "cartButton";
  let buttonText = document.createTextNode("Remove");
  cartButton.appendChild(buttonText);
  newRow.appendChild(cartButton);
  ///pushes food id into cart array
  cartItems.push(foodID);
  updateCartPrice();
}

let totalCartPrice = "";
function updateCartPrice() {
  let totalPrice = 0;
  for (i = 0; i < cartItems.length; i++) {
    let value = cartItems[i];
    let foodPrice = foodArray[value].foodPrice;
    totalPrice = Number(totalPrice) + Number(foodPrice);
  }
  document.getElementById("cartPrice").innerHTML = "$" + totalPrice + ":00";
  totalCartPrice = totalPrice;
}

function confirmBooking() {
  document.getElementById("bookingDetails").scrollIntoView();

  document.getElementById("finalBookingDate").innerHTML =
    "Booking Date: " + bookedDate;
  document.getElementById("finalBookingTime").innerHTML =
    "Time of Departure: " + bookedTime;
  document.getElementById("finalBookingBoat").innerHTML =
    "Boat Name: " + bookedBoat;

  document.getElementById("finalSeats").innerHTML =
    "Booked Seats: " + confirmedSeats;
  document.getElementById("finalBookingPrice").innerHTML =
    "Seat Price: " + finalSeatPrice;
  document.getElementById("finalCartPrice").innerHTML =
    "Menu Price: " + totalCartPrice;
  let finalPrice = Number(finalSeatPrice) + Number(totalCartPrice);
  document.getElementById("finalTotalPrice").innerHTML =
    "Total Booking Price: $" + finalPrice;
}

function refresh() {
  document.getElementById("topMenu").scrollIntoView();
  foodArray = [];
  seatsArray = [];
  selectedSeats = [];
  cartItems = [];

  removeBoats();
}

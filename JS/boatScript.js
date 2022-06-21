///Connect to XML file

if (window.XMLHttpRequest) {
  xmlhttp = new XMLHttpRequest();
} else {
  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.open("GET", "boat.xml", false);
xmlhttp.send();
xmlDoc = xmlhttp.responseXML;

///different classes
class Seat {
  constructor(boat, seatID, price, seatName) {
    this.boat = boat;
    this.seatID = seatID;
    this.price = price;

    this.seatName = seatName;
  }
}

class Food {
  constructor(foodName, foodPrice, foodInfo, foodID) {
    this.foodName = foodName;
    this.foodPrice = foodPrice;
    this.foodInfo = foodInfo;
    this.foodID = foodID;
  }
}

class Weather {
  constructor(date, temp, desc) {
    this.date = date;
    this.temp = temp;
    this.desc = desc;
  }
}

class Cart {
  constructor(itemName, quantity, price, totalPrice, cartID) {
    this.itemName = itemName;
    this.quantity = quantity;
    this.price = price;
    this.totalPrice = totalPrice;
    this.cartID = cartID;
  }
}

///different variables for the booking
let selectedBoat = "";
let selectedDate = "";
let selectedTime = "";
let selectedPeople = "";
let seatsArray = [];
let foodArray = [];
let weatherArray = [];
let selectedSeats = [];
let cartArray = [];

///different variables for the final confirmation
let confirmedSeats = [];
let bookedTime = "";
let bookedDate = "";
let bookedBoat = "";

///all the seats elements
let allSeats = document.getElementsByClassName("seat");

///PAGE ONE
function initiate() {
  loadMenu();
  addToCart();
  restrictDate();
  getWeather();
}

function displayPageOne() {
  removeBoats();
  selectedSeats = [];
  removeAllBookingRows();
  document.getElementById("boatName1").style.display = "none";
  document.getElementById("boatName2").style.display = "none";
  document.getElementById("page1").style.display = "block";
  document.getElementById("page2").style.display = "none";
  document.getElementById("page3").style.display = "none";
  document.getElementById("page4").style.display = "none";
  selectedSeats = [];
}

function displayPageTwo() {
  let boatSelected = document.getElementById("boatSelect");
  let boatText = boatSelected.options[boatSelect.selectedIndex].text;

  let timeSelected = document.getElementById("timeSelect");
  let timeText = timeSelected.options[timeSelect.selectedIndex].text;

  let dateSelected = document.getElementById("bookingDate");
  let dateText = dateSelected.value;

  selectedTime = timeText;
  let peopleSelected = document.getElementById("peopleSelect");
  let peopleText = peopleSelected.value;
  if (dateText == "") {
    alert("select a date");
  } else if (peopleText == "") {
    alert("select number of people");
  } else if (checkWeather(dateText) === false) {
    alert("Conditions unsuitable for booking date");
  } else {
    selectedTime = timeText;
    selectedBoat = boatText;
    selectedTime = timeText;
    selectedDate = dateText;
    selectedPeople = peopleText;
    if (boatText == "Tere Boat") {
      loadTere();
      document.getElementById("boatName1").style.display = "block";
    } else {
      loadNui();
      document.getElementById("boatName2").style.display = "block";
    }
    randomBooking();
    selectSeat();
    popup();

    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
    document.getElementById("page3").style.display = "none";
    document.getElementById("page4").style.display = "none";
  }
}

//Displays page Two without checking conditions
function forceDisplayPageTwo() {
  let boatSelected = document.getElementById("boatSelect");
  let boatText = boatSelected.options[boatSelect.selectedIndex].text;

  let timeSelected = document.getElementById("timeSelect");
  let timeText = timeSelected.options[timeSelect.selectedIndex].text;

  let dateSelected = document.getElementById("bookingDate");
  let dateText = dateSelected.value;

  selectedTime = timeText;
  let peopleSelected = document.getElementById("peopleSelect");
  let peopleText = peopleSelected.value;
  if (dateText == "") {
    alert("select a date");
  } else if (peopleText == "") {
    alert("select number of people");
  } else {
    selectedTime = timeText;
    selectedBoat = boatText;
    selectedTime = timeText;
    selectedDate = dateText;
    selectedPeople = peopleText;
    if (boatText == "Tere Boat") {
      loadTere();
      document.getElementById("boatName1").style.display = "block";
    } else {
      loadNui();
      document.getElementById("boatName2").style.display = "block";
    }
    markAsBooked();
    randomBooking();
    selectSeat();
    popup();

    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
    document.getElementById("page3").style.display = "none";
    document.getElementById("page4").style.display = "none";
  }
}

function displayPageThree() {
  if (seatsLeft == 0) {
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "none";
    document.getElementById("page3").style.display = "block";
    document.getElementById("page4").style.display = "none";
  } else {
    alert("You still need to select " + seatsLeft + " more seats!");
  }
}

function displayPageFour() {
  confirmBooking();
  document.getElementById("page1").style.display = "none";
  document.getElementById("page2").style.display = "none";
  document.getElementById("page3").style.display = "none";
  document.getElementById("page4").style.display = "block";
}

function cartBack() {
  document.getElementById("page1").style.display = "none";
  document.getElementById("page2").style.display = "block";
  document.getElementById("page3").style.display = "none";
  document.getElementById("page4").style.display = "none";
}

///functions are in order of use

///PAGE ONE

///gets the weather data from the API
function getWeather() {
  let url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=-45.079786621791584&lon=168.53875588689522&exclude=minutely,hourly&units=metric&appid=db9c66f21a946c630c2ab6d132e4a05c";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    });
}
let currentDate;
///displays the weather for the next four days
function displayWeather(data) {
  let currentTemp = Number(data.current.temp);
  let currentDesc = data.current.weather[0].description;
  let currentWords = currentDesc.split(" ");

  for (let i = 0; i < currentWords.length; i++) {
    currentWords[i] =
      currentWords[i][0].toUpperCase() + currentWords[i].substr(1);
  }
  let uppercaseCurrentDesc = currentWords.join(" ");
  let currentIcon = data.current.weather[0].icon;
  let currentTimeStamp = data.current.dt;
  let currentWeatherDate = new Date(currentTimeStamp * 1000).toISOString();
  let currentFormatDate = currentWeatherDate.split("T")[0];

  document.getElementById("todayMax").innerHTML = currentTemp + "°C";
  document.getElementById("todayDesc").innerHTML = uppercaseCurrentDesc;
  document.getElementById("todayImg").src =
    "http://openweathermap.org/img/wn/" + currentIcon + "@4x.png";
  currentDate = currentFormatDate;

  for (i = 1; i < 5; i++) {
    let temp = Number(data.daily[i].temp.day);
    let desc = data.daily[i].weather[0].description;
    let descWords = desc.split(" ");

    for (let i = 0; i < descWords.length; i++) {
      descWords[i] = descWords[i][0].toUpperCase() + descWords[i].substr(1);
    }
    let uppercaseDesc = descWords.join(" ");
    let timeStamp = data.daily[i].dt;
    let weatherDate = new Date(timeStamp * 1000).toISOString();
    let formatDate = weatherDate.split("T")[0];

    let icon = data.daily[i].weather[0].icon;
    let iconURL = "http://openweathermap.org/img/wn/" + icon + "@4x.png";

    document.getElementById("day" + (i + 1) + "Max").innerHTML = temp + "°C";
    document.getElementById("day" + (i + 1) + "Desc").innerHTML = uppercaseDesc;
    document.getElementById("day" + (i + 1) + "Date").innerHTML = formatDate;
    document.getElementById("day" + (i + 1) + "Img").src = iconURL;

    weatherArray.push(new Weather(formatDate, temp, uppercaseDesc));
  }
}

///restricts the date from today to next 4 days
function restrictDate() {
  var timezoneOffset = new Date().getTimezoneOffset() * 60000;
  var today = new Date(Date.now() - timezoneOffset).toISOString().split("T")[0];

  var nextWeekDate = new Date(
    Date.now() - timezoneOffset + 4 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];
  var bookingDate = document.getElementById("bookingDate");
  bookingDate.setAttribute("min", today);
  bookingDate.setAttribute("max", nextWeekDate);
}

/// Check to see if the time has passed if departing today
function checkTime(time) {
  var todayDate = new Date();
  var options = { hour12: false };
  var todayDate24 = todayDate.toLocaleTimeString("en-NZ", options);
  var format1 = todayDate24.replace(":", "");
  var format2 = format1.replace(":", "");
  var currentTime = format2.substring(0, 4);
  var bookingTime = time.replace(":", "");

  if (bookingTime < currentTime) {
    return false;
  } else {
    return true;
  }
}

/// check to see if conditions are ok to sail
function checkWeather(dateText) {
  if (currentDate == dateText) {
    if (checkTime(bookedTime) === false) {
      alert("Boat has already departed, pick another time or date");
      return false;
    } else if (checkTime(bookedTime) === true) {
      return true;
    }
  } else {
    for (i = 0; i < weatherArray.length; i++) {
      let checkDate = weatherArray[i].date;
      if (checkDate == dateText) {
        let weather = weatherArray[i].desc;
        ///change value to test as all days are too cold
        //set  to temp < 14
        if (weatherArray[i].temp < 14 || weather.includes("Rain")) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
}

///PAGE TWO

///displays the weather for the selected date
function displaySelectedWeather() {
  for (i = 0; i < weatherArray.length; i++) {
    if ((weatherArray[i].date = selectedDate)) {
      let selectedTemp = weatherArray[i].temp;
      let selectedDesc = weatherArray[i].desc;

      document.getElementById("selectedDate").innerHTML =
        "Date: " + selectedDate;
      document.getElementById("selectedTemp").innerHTML =
        "Temperature: " + selectedTemp;
      document.getElementById("selectedDesc").innerHTML =
        "Description: " + selectedDesc;
    }
  }
}
let = alphabetArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
///Using DOM displays the TERE boat from the XML file
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
      let seatNumber = Number([i]) + 1;
      newSeatID = seatNumber + alphabetArray[j];
      newSeat.id = count;

      seatsArray.push(new Seat(boatName, count, price, newSeatID));
      document.getElementById(rowID).appendChild(newSeat);
      count++;
    }
  }
}

///Using DOM displays the NUI boat from the XML file
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
      let p1 = document.createElement("p");
      if (j == middle) {
        newSeat.style.marginLeft = "50px";
      }

      newSeat = document.createElement("div");
      newSeat.classList.add("seat");
      let seatNumber = Number([i]) + 1;
      newSeatID = seatNumber + alphabetArray[j];
      newSeat.id = count;

      boatName = "nui";
      seatsArray.push(new Seat(boatName, count, price, newSeatID));
      document.getElementById(rowID).appendChild(newSeat);
      count++;
    }
  }
}
///fills in booked seats in random locations
function randomBooking() {
  if (allSeats.length > 0) {
    for (i = 0; i < 20; i++) {
      allSeats[Math.floor(Math.random() * allSeats.length)].classList.toggle(
        "booked"
      );
    }
  }
}
///Any seats in the confirmed seats array will be marked as booked
function markAsBooked() {
  let newSeats = [];
  if (
    bookedTime == selectedTime &&
    bookedDate == selectedDate &&
    bookedBoat == selectedBoat
  ) {
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

function popup() {
  for (i = 0; i < allSeats.length; i++) {
    allSeats[i].addEventListener("mouseenter", function (e) {
      let seatPopup = document.getElementById("seatPopup");
      seatPopup.style.display = "block";
      let newID = e.currentTarget.id;
      seatBox = document.getElementById(newID).getBoundingClientRect();
      seatX = Number(seatBox.left) - 180;
      seatY = Number(seatBox.top) - 180;

      seatPopup.style.marginLeft = seatX + "px";
      seatPopup.style.marginTop = seatY + "px";

      for (x = 0; x < seatsArray.length; x++) {
        if (seatsArray[x].seatID == newID) {
          let seatName = seatsArray[x].seatName;
          let seatPrice = seatsArray[x].price;

          document.getElementById("popupName").innerHTML = "Seat: " + seatName;
          document.getElementById("popupPrice").innerHTML =
            "Price: $" + seatPrice + ".00";
        }
      }
    });
  }
  for (j = 0; j < allSeats.length; j++) {
    allSeats[j].addEventListener("mouseleave", function (e) {
      let seatPopup = document.getElementById("seatPopup");
      seatPopup.style.display = "none";
    });
  }
}

///Makes every seat an event listener and clicking on a seat will toggle selected
function selectSeat() {
  let seatCount = 0;
  let numPeople = Number(selectedPeople);
  seatsLeft = Number(numPeople) - Number(seatCount);

  if (seatCount < selectedPeople) {
  }
  for (i = 0; i < allSeats.length; i++) {
    allSeats[i].addEventListener("click", function (e) {
      if (
        e.currentTarget.classList.contains("seat") &&
        !e.currentTarget.classList.contains("selected") &&
        !e.currentTarget.classList.contains("booked") &&
        !e.currentTarget.classList.contains("confirmed")
      ) {
        if (seatCount < numPeople) {
          e.currentTarget.classList.toggle("selected");
          let selectedSeat = e.currentTarget.id;
          selectedSeats.push(selectedSeat);
          console.log(selectedSeat);
          console.log(selectedSeats);
          getPrice();
          newSeatBookingRow(selectedSeat);
          seatCount++;
          seatsLeft = Number(numPeople) - Number(seatCount);
        } else {
          alert("You have chosen seats for each person");
        }
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
        removeBookingRow(seatID2);
        getPrice();

        seatCount--;
        seatsLeft = Number(numPeople) - Number(seatCount);
      }
    });
  }
}

function newSeatBookingRow(seat2) {
  let count = 0;
  for (let i = 0; i < seatsArray.length; i++)
    if (seat2 == seatsArray[i].seatID) {
      let seatName = seatsArray[i].seatName;
      let seatPrice = seatsArray[i].price;
      let container = document.getElementById("bookingRowContainer");
      let newRow = document.createElement("div");
      newRow.className = "bookingRow";
      newRow.id = "booking" + seat2 + "row";

      container.appendChild(newRow);
      let p1 = document.createElement("p");
      let bookingRowText = document.createTextNode(seatName);
      p1.classname = "seatName";
      p1.appendChild(bookingRowText);
      newRow.appendChild(p1);
      let p2 = document.createElement("p");
      let priceText = document.createTextNode("$" + seatPrice);
      p2.appendChild(priceText);
      newRow.appendChild(p2);
      count++;
    }
}

let allBookingRows = document.getElementsByClassName("bookingRow");
function removeBookingRow(seat) {
  if (allBookingRows.length > 0) {
    let bookingRowID = "booking" + seat + "row";
    let bookingRow = document.getElementById(bookingRowID);
    bookingRow.parentNode.removeChild(bookingRow);
  }
}

function removeAllBookingRows() {
  const rows = document.querySelectorAll(".bookingRow");

  rows.forEach((row) => {
    row.remove();
    getPrice();
  });
}

///gets the price of each selected seat and displays in the priceContainer
let finalSeatPrice = "";
function getPrice() {
  let totalPrice = 0;
  for (i = 0; i < selectedSeats.length; i++) {
    let value = selectedSeats[i];
    let seatPrice = seatsArray[value].price;
    totalPrice = Number(totalPrice) + Number(seatPrice);
  }
  document.getElementById("totalBookingPrice").innerHTML =
    "$" + totalPrice + ".00";
  finalSeatPrice = totalPrice;
}

///removes the boat ui on back button
function removeBoats() {
  let tereExist = document.getElementById("tereBoat");
  let nuiExist = document.getElementById("nuiBoat");

  if (nuiExist === null) {
    let tere = document.getElementById("tereBoat");
    tere.parentNode.removeChild(tere);
  } else if (tereExist === null) {
    let nui = document.getElementById("nuiBoat");
    nui.parentNode.removeChild(nui);
  }
}

/// function to populate food list

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
    foodArray.push(new Food(foodName, price, info, i));
  }
}

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
  quantity.min = 1;
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
  console.log(cartArray);

  cartArray.push(new Cart(foodName, 1, foodPrice, foodPrice, foodID));
  updateCartPrice();
  console.log(cartArray);
}

let allFoodButtons = document.getElementsByClassName("foodButton");
function addToCart() {
  for (i = 0; i < allFoodButtons.length; i++) {
    allFoodButtons[i].addEventListener("click", function (e) {
      let selectedFood = e.currentTarget.id;
      let foodID = selectedFood.replace(/\D/g, "");

      displayCart(foodID);

      ///add it to array get price and seat id
    });
  }
}

function displayCart(foodID) {
  if (cartArray.length > 0) {  
    for (i = 0; i < cartArray.length; i++) {
      if (cartArray[i].cartID == foodID) {
        console.log("Already in Cart Array");
      } else {
        newCartItem(foodID);
        quantityChanged();
        removeFromCart();
      }
    }
  }
  if (cartArray.length == 0) {
    newCartItem(foodID);
    quantityChanged();
    removeFromCart();
  }
}

let allCartButtons = document.getElementsByClassName("cartButton");

function removeFromCart() {
  for (i = 0; i < allCartButtons.length; i++) {
    allCartButtons[i].addEventListener("click", function (e) {
      let button = e.currentTarget.id;
      let ID = button.replace(/\D/g, "");
      let cartRow = "row" + ID;

      removeCartRow(e);

      ///add it to array get price and seat id
    });
  }
}
function removeCartRow(e) {
  let rowToDelete = e.currentTarget.parentElement;
  let rowID1 = rowToDelete.id;
  let rowID2 = rowID1.slice(3);
  console.log(rowID2);

  if (allCartButtons.length > 0) {
    for (i = 0; i < cartArray.length; i++) {
      if (cartArray[i].cartID == rowID2) {
        console.log("REMOVE ROW");
        rowToDelete.remove();
        cartArray.splice([i], 1);

        updateCartPrice();
      }
    }
  }
}

let oldValue;
let allCartInputs = document.getElementsByClassName("cartQuantity");
function quantityChanged() {
  for (var i = 0; i < allCartInputs.length; i++) {
    let input = allCartInputs[i];
    oldValue = input.value;
    input.addEventListener("change", updateQuantity);
  }
}

function updateQuantity(event) {
  let input = event.target;
  let newValue = input.value;

  let inputID = event.target.id;
  let foodID = inputID.replace(/\D/g, "");

  if (oldValue < newValue) {
    oldValue = newValue;
    for (i = 0; i < cartArray.length; i++) {
      if (cartArray[i].cartID == foodID) {           
        let price = cartArray[i].price;
        let totalPrice = Number(price) * Number(newValue);
        cartArray[i].quantity = newValue;
        cartArray[i].totalPrice = totalPrice;     
        updateCartPrice();
      }
    }
  } else {
    oldValue = newValue;
    for (i = 0; i < cartArray.length; i++) {
      if (cartArray[i].cartID == foodID) {          
        let price2 = cartArray[i].price;
        let totalPrice2 = Number(price2) * Number(newValue);
        cartArray[i].quantity = newValue;
        cartArray[i].totalPrice = totalPrice2;      
        updateCartPrice();
      }
    }
  }
}

function removeAllRows() {
  const rows = document.querySelectorAll(".cartRow");
  rows.forEach((row) => {
    row.remove();
    updateCartPrice();
  });
}

let totalCartPrice = "";
function updateCartPrice() {
  let totalPrice = 0;
  for (i = 0; i < cartArray.length; i++) {
    let foodPrice = cartArray[i].totalPrice;
    totalPrice = Number(totalPrice) + Number(foodPrice);
  }
  document.getElementById("cartPrice").innerHTML = "$" + totalPrice + ".00";
  totalCartPrice = totalPrice;
}

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

  bookedTime = selectedTime;
  bookedDate = selectedDate;
  bookedBoat = selectedBoat;
}

function confirmBooking() {
  document.getElementById("finalBookingDate").innerHTML = selectedDate;
  document.getElementById("finalBookingTime").innerHTML = selectedTime;
  document.getElementById("finalBookingBoat").innerHTML = selectedBoat;
  document.getElementById("finalBookingPeople").innerHTML = selectedPeople;
  for (let i = 0; i < seatsArray.length; i++) {
    for (let j = 0; j < selectedSeats.length; j++) {
      if (seatsArray[i].seatID == selectedSeats[j]) {
        let seatName = seatsArray[i].seatName;
        let seatPrice = seatsArray[i].price;

        let rowToAttach = document.getElementById("bookingRow3");
        let p1 = document.createElement("p");
        let bookingText = document.createTextNode(seatName);
        p1.appendChild(bookingText);
        rowToAttach.appendChild(p1);
        let p2 = document.createElement("p");
        let bookingPrice = document.createTextNode("$" + seatPrice + ".00");
        p2.appendChild(bookingPrice);
        rowToAttach.appendChild(p2);
      }
    }
  }

  for (let k = 0; k < cartArray.length; k++) {
    let fName = cartArray[k].itemName;
    let quantity = cartArray[k].quantity;
    let tPrice = cartArray[k].totalPrice;
    let rowToAttach = document.getElementById("bookingRow4");
    let p1 = document.createElement("p");
    let foodText = document.createTextNode(fName + " x" + quantity);
    p1.appendChild(foodText);
    rowToAttach.appendChild(p1);
    let p2 = document.createElement("p");
    let foodPrice = document.createTextNode("$" + tPrice + ".00");
    p2.appendChild(foodPrice);
    rowToAttach.appendChild(p2);
  }

  document.getElementById("totalSeatPrice").innerHTML =
    "Total Seat Price: $" + finalSeatPrice + ".00";
  document.getElementById("totalMenuPrice").innerHTML =
    "Total Menu Price: $" + totalCartPrice + ".00";
  let finalPrice = Number(finalSeatPrice) + Number(totalCartPrice);
  document.getElementById("totalPrice").innerHTML =
    "Total Booking Price: $" + finalPrice + ".00";
}

function deleteReceipt() {
  document.getElementById("finalBookingDate").innerHTML = "";
  document.getElementById("finalBookingTime").innerHTML = "";
  document.getElementById("finalBookingBoat").innerHTML = "";
  document.getElementById("finalBookingPeople").innerHTML = "";
  document.getElementById("totalSeatPrice").innerHTML = "";
  document.getElementById("bookingRow3").innerHTML = "";
  document.getElementById("bookingRow4").innerHTML = "";
  document.getElementById("totalMenuPrice").innerHTML = "";
  document.getElementById("totalPrice").innerHTML = "";
}

function refresh() {
  cartArray = [];
  deleteReceipt();
  document.getElementById("menuContainer").innerHTML = "";
  document.getElementById("cartPrice").innerHTML = "";
  deleteReceipt();
  confirmSeats();
  selectedSeats = [];
  displayPageOne();
  foodArray = [];
  initiate();
  removeAllRows();
  updateCartPrice();
}

function recieptBack() {
  deleteReceipt();
  displayPageThree();
}

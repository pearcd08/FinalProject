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
  constructor(boat, seatID, price, booked, seatName) {
    this.boat = boat;
    this.seatID = seatID;
    this.price = price;
    this.booked = booked;
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

///different variables for the booking
let selectedBoat = "";
let selectedDate = "";
let selectedTime = "";
let selectedPeople = "";
let seatsArray = [];
let foodArray = [];
let weatherArray = [];
let selectedSeats = [];

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
  console.log(peopleText);
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
      document.getElementById("boatName").innerHTML = "Tere Boat";
    } else {
      loadNui();
      document.getElementById("boatName").innerHTML = "Nui Boat";
    }
    randomBooking();
    selectSeat();

    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
    document.getElementById("page3").style.display = "none";
    document.getElementById("page4").style.display = "none";
  }
}

function displayPageThree() {
  console.log(seatsLeft);
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
  console.log(weatherArray);
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
  console.log(today);
}
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
      console.log("today, weather doesn't matter");
      return true;
    }
  } else {
    for (i = 0; i < weatherArray.length; i++) {
      let checkDate = weatherArray[i].date;
      if (checkDate == dateText) {
        let weather = weatherArray[i].desc;
        console.log("dateText" + dateText);
        ///change value to test as all days are too cold
        //set  to temp < 14
        if (weatherArray[i].temp < 14 || weather.includes("Rain")) {
          console.log(weatherArray[i].date);
          console.log(weather);
          return false;
        } else {
          console.log(weatherArray[i].date);
          console.log(weather);
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
      let p1 = document.createElement("p");
      let seatText = document.createTextNode("$" + price);
      p1.className = "seatPrice";

      p1.appendChild(seatText);
      newSeat.appendChild(p1);

      seatsArray.push(new Seat(boatName, count, price, false, newSeatID));
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
        p1.style.marginLeft = "-100px";
      }

      p1.style.marginLeft = "-50px";

      newSeat = document.createElement("div");
      newSeat.classList.add("seat");
      let seatNumber = Number([i]) + 1;
      newSeatID = seatNumber + alphabetArray[j];
      newSeat.id = count;

      let seatText = document.createTextNode("$" + price);
      p1.className = "seatPrice";
      p1.appendChild(seatText);
      newSeat.appendChild(p1);
      boatName = "nui";
      seatsArray.push(new Seat(boatName, count, price, false, newSeatID));
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
    markAsBooked();
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



function clearSelected() {
  selectedSeats = [];
  getPrice();
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

let allBookingRows = document.getElementsByClassName("bookingRow");
function removeBookingRow(seat) {
  if (allBookingRows.length > 0) {
    let bookingRowID = "bookingRow" + seat;
    console.log(bookingRowID);
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

function newSeatBookingRow(seat) {
  for (let i = 0; i < seatsArray.length; i++)
    if (seat == seatsArray[i].seatID) {
      let seatName = seatsArray[i].seatName;
      let seatPrice = seatsArray[i].price;
      console.log(seatName + "" + seatPrice);

      let container = document.getElementById("bookingRowContainer");
      let newRow = document.createElement("div");
      newRow.className = "bookingRow";
      newRow.id = "bookingRow" + seatsArray[i].seatID;
      container.appendChild(newRow);
      let p1 = document.createElement("p");
      let bookingRowText = document.createTextNode(seatName);
      p1.classname = "seatName";
      p1.appendChild(bookingRowText);
      newRow.appendChild(p1);
      let p2 = document.createElement("p");
      let priceText = document.createTextNode("$" + seatPrice);
      p2.className = "seatPrice2";
      p2.appendChild(priceText);
      newRow.appendChild(p2);
    }
}

///gets the price of each selected seat and displays in the priceContainer
let finalSeatPrice = "";
function getPrice() {
  let totalPrice = 0;
  for (i = 0; i < selectedSeats.length; i++) {
    let value = selectedSeats[i];
    console.log(value);
    let seatPrice = seatsArray[value].price;
    totalPrice = Number(totalPrice) + Number(seatPrice);
  }
  document.getElementById("totalBookingPrice").innerHTML =
    "$" + totalPrice + ".00";
  finalSeatPrice = totalPrice;

  console.log("totalP" + totalPrice);
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

function backButton() {
  selectedSeats = [];
  removeBoats();

  let textPrice = document.getElementById("totalPrice");
  textPrice.value = "";
  let textSeats = document.getElementById("totalSeats");
  textSeats.value = "";
}
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

let cartItems = [];

function displayCart(foodID) {
  if (cartItems.indexOf(foodID) == -1) {
    newCartItem(foodID);
    quantityChanged();
    removeFromCart();
  } else {
    let newQuantity = document.getElementById("quantity" + foodID);
    let oldValue = newQuantity.value;
    let newValue = Number(oldValue) + 1;
    newQuantity.value = newValue;
    cartItems.push(foodID);

    updateCartPrice();
  }
}

let allCartButtons = document.getElementsByClassName("cartButton");

function removeFromCart() {
  for (i = 0; i < allCartButtons.length; i++) {
    allCartButtons[i].addEventListener("click", function (e) {
      let button = e.currentTarget.id;
      let ID = button.replace(/\D/g, "");
      let cartRow = "row" + ID;
      removeRow(cartRow, ID);

      ///add it to array get price and seat id
    });
  }
}
let oldValue;
let allCartInputs = document.getElementsByClassName("cartQuantity");
function quantityChanged() {
  for (var i = 0; i < allCartInputs.length; i++) {
    let input = allCartInputs[i];
    oldValue = input.value;
    console.log(oldValue);
    input.addEventListener("change", updateQuantity);
  }
}

function updateQuantity(event) {
 
  let input = event.target;
  let newValue = input.value;
  console.log(oldValue);
  console.log(newValue)

  let inputID = event.target.id;
  let foodID = inputID.replace(/\D/g, "");

  let myIndex = cartItems.indexOf(foodID);

  if (oldValue < newValue) {
    console.log("increased");
    cartItems.push(foodID);
    updateCartPrice();
    oldValue = newValue;
  } else {
    console.log("decreased");
    cartItems.splice(myIndex, 1);
    updateCartPrice();
    oldValue = newValue;
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
  } else {
    console.log("cart");
  }
}

function removeAllRows() {
  const rows = document.querySelectorAll(".cartRow");

  rows.forEach((row) => {
    row.remove();
    updateCartPrice();
  });
}



///gets the letiables

function newCartItem(foodID) {
  console.log(foodArray);
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
  document.getElementById("menuContainer").scrollIntoView();
  bookedTime = selectedTime;
  bookedDate = selectedDate;
  bookedBoat = selectedBoat;
  console.log("Confirmed Seats:" + confirmedSeats);
  console.log(bookedDate);
  console.log(bookedBoat);
}

function confirmBooking() {
  document.getElementById("finalBookingDate").innerHTML =
    "Booking Date: " + selectedDate;
  document.getElementById("finalBookingTime").innerHTML =
    "Time of Departure: " + selectedTime;
  document.getElementById("finalBookingBoat").innerHTML =
    "Boat Name: " + selectedBoat;
  document.getElementById("finalBookingPeople").innerHTML =
    "Number of People: " + selectedPeople;
  for (let i = 0; i < seatsArray.length; i++) {
    for (let j = 0; j < selectedSeats.length; j++) {
      if (seatsArray[i].seatID == selectedSeats[j]) {
        let seatName = seatsArray[i].seatName;
        let seatPrice = seatsArray[i].price;
        console.log("booking" + seatName + "" + seatPrice);        
        let rowToAttach = document.getElementById("finalSeats");
        let p1 = document.createElement("p");
        let bookingText = document.createTextNode(seatName);
        p1.appendChild(bookingText);    
        rowToAttach.appendChild(p1);
        let p2 = document.createElement("p");
        let bookingPrice = document.createTextNode("$"+seatPrice+".00");
        p2.appendChild(bookingPrice);    
        rowToAttach.appendChild(p2);
      }
    }
  }

 
  
  for (let k = 0; k < foodArray.length; k++) {

    for (let l = 0; l < cartItems.length; l++) {

      if (foodArray[k].foodID == cartItems[l]) {
        console.log("YYYYYYYY");
        let fName =foodArray[k].foodName;
        let fPrice = foodArray[k].foodPrice;
        let rowToAttach = document.getElementById("finalCart");
        let p1 = document.createElement("p");
        p1.className = "finalFoodName";
        let foodText = document.createTextNode(fName);
        p1.appendChild(foodText);    
        rowToAttach.appendChild(p1);
        let p2 = document.createElement("p");
         p2.className = "finalFoodPrice";
        let foodPrice2 = document.createTextNode("$"+fPrice+".00");
        p2.appendChild(foodPrice2);    
        rowToAttach.appendChild(p2);

      }}}
  console.log(foodArray);



  document.getElementById("finalBookingPrice").innerHTML =
    "Total Seat Price: $" + finalSeatPrice+".00";
  document.getElementById("finalCartPrice").innerHTML =
    "Total Menu Price: $" + totalCartPrice+".00";
  let finalPrice = Number(finalSeatPrice) + Number(totalCartPrice);
  document.getElementById("finalTotalPrice").innerHTML =
    "Total Booking Price: $" + finalPrice+".00";
 
}

function deleteReceipt(){
  document.getElementById("finalBookingPrice").innerHTML ="";
  document.getElementById("finalCartPrice").innerHTML ="";
  document.getElementById("finalTotalPrice").innerHTML ="";
  document.getElementById("finalSeats").innerHTML = "";
  document.getElementById("finalCart").innerHTML = "";

}

function refresh() {
  deleteReceipt();
  document.getElementById("menuContainer").innerHTML="";
  document.getElementById("cartPrice").innerHTML="";
  deleteReceipt();
  confirmSeats(); 
  displayPageOne();
  foodArray = [];
 initiate();
 removeAllRows();




 cartItems = [];


 updateCartPrice();

  
}

function recieptBack(){
  deleteReceipt();
  displayPageThree();
}
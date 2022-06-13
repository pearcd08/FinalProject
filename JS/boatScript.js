var boat = "";
var date = "";
var time = "";

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

class Food{
  constructor(foodName, foodPrice, foodInfo){
    this.foodName = foodName;
    this.foodPrice = foodPrice;
    this.foodInfo = foodInfo;
  }
}

seatsArray = [];
foodArray = [];

function loadMenu(){
  seatsArray = [];
  var menu = xmlDoc.getElementsByTagName("menu"); 

  var food = menu[0].getElementsByTagName("food");
  for (i=0; i<food.length; i++){
    var newFood = document.createElement("div");
    foodID = "food" + i;    
    newFood.id = foodID;
    newFood.className = "food";
    foodName = food[i].getElementsByTagName("name")[0].childNodes[0].nodeValue; 
    
    price = food[i].getElementsByTagName("price")[0].childNodes[0].nodeValue;
    info = food[i].getElementsByTagName("info")[0].childNodes[0].nodeValue;
    fImage = food[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;   
   
    document.getElementById("menuContainer").appendChild(newFood);    

    var foodContainer = document.getElementById(foodID);
    //create title of food
    var foodHeader = document.createElement("h1");
    var headerText = document.createTextNode(foodName);
    foodHeader.appendChild(headerText);
    foodContainer.appendChild(foodHeader);
    //create image for food
    var foodImage = document.createElement('img');    
    foodImage.src = fImage;
    foodImage.alt = foodName;
    foodImageID = "image" + i;
    foodImage.id = foodImageID;
    foodImage.class = food;
    foodImage.height = 200;
    foodImage.width = 300;   
    foodContainer.appendChild(foodImage);
    //create paragraph for food info
    var paragraph = document.createElement("p");
    var infoText = document.createTextNode("Information: " + info);
    paragraph.appendChild(infoText);   ;
    foodContainer.appendChild(paragraph);
    //create paragraphc for price
    var paragraph2 = document.createElement("p")
    var priceText = document.createTextNode("Price: $" + price +".00");
    paragraph2.appendChild(priceText);
    foodContainer.appendChild(paragraph2);
    //create numberpicker
    var numberPicker = document.createElement("button");
    numberPicker.className = "button";
    var buttonText = document.createTextNode("Add to Cart");
    numberPicker.appendChild(buttonText);
    foodContainer.appendChild(numberPicker);
    //create add to cart button
  
    
  

   
    foodArray.push(new Food(foodName, price, info));

  }
  console.log(foodArray);
}

function loadTere() {
  seatsArray = [];
  var tere = xmlDoc.getElementsByTagName("tere");
  var tereDiv = document.createElement("div");
  tereDiv.id = "tereBoat";
  document.getElementById("boatContainer").appendChild(tereDiv);
  var rows = tere[0].getElementsByTagName("row");
  var count = 0;
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
      var middle = seats / 2 + 1;
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
  var nui = xmlDoc.getElementsByTagName("nui");
  var nuiDiv = document.createElement("div");
  nuiDiv.id = "nuiBoat";
  document.getElementById("boatContainer").appendChild(nuiDiv);
  var rows = nui[0].getElementsByTagName("row");
  var count = 0;
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
      var middle = seats / 2 + 1;
      if (j == middle) {
        newSeat.style.marginLeft = "50px";
      }
      newSeat = document.createElement("div");
      newSeat.className = "seat";
      boatName = "nui";
      seatsArray.push(new Seat(boatName, count, price, false));
      document.getElementById(rowID).appendChild(newSeat);
      count++;
    }
  }
}

var selectedSeats = [];
var allSeats = document.getElementsByClassName("seat");

function selectSeat() {
  for (i = 0; i < allSeats.length; i++) {
    allSeats[i].addEventListener("click", function (e) {
      if (
        e.currentTarget.classList.contains("seat") &&
        !e.currentTarget.classList.contains("selected") &&
        !e.currentTarget.classList.contains("booked")
      ) {
   
        e.currentTarget.classList.toggle("selected");
        var selectedSeat = e.currentTarget.id;
        selectedSeats.push(selectedSeat);
       
        getPrice();
      } else if (
        e.currentTarget.classList.contains("selected") &&
        !e.currentTarget.classList.contains("booked")
      ) {
        e.currentTarget.classList.remove("selected");

        var seatID2 = e.currentTarget.id;
        var myIndex = selectedSeats.indexOf(seatID2);
        if (myIndex !== -1) {
          selectedSeats.splice(myIndex, 1);
        }
        getPrice();
        console.log(selectedSeats);
      }

      ///add it to array get price and seat id
    });
  }
}
///all the seats

var confirmedSeats = [];
var bookedTime = "";
var bookedDate = "";
var bookedBoat = "";
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
  var newSeats = [];
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


function getPrice(){
  let totalPrice= 0;
  for(i = 0; i < selectedSeats.length; i ++)
  {
  
  let value = selectedSeats[i];   
  let seatPrice = seatsArray[value].price; 
  totalPrice = Number(totalPrice) + Number(seatPrice);
   
  }
 
  var textPrice = document.getElementById('totalPrice');  
  textPrice.value = "$"+totalPrice+".00";
  var textSeats = document.getElementById('totalSeats');  
  textSeats.value = selectedSeats;
  



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
    var tere = document.getElementById("tereBoat");
    tere.parentNode.removeChild(tere);
  } else {
    var nui = document.getElementById("nuiBoat");
    nui.parentNode.removeChild(nui);
  }
}

/// function to populate food list

function displayPageOne() {
  page1.style.display = "block";
  loadMenu()
}

function backButton() {
  removeBoats();
  selectedSeats = [];
  console.log(confirmedSeats);
  var textPrice = document.getElementById("totalPrice");
  textPrice.value = "";
  var textSeats = document.getElementById("totalSeats");
  textSeats.value = "";
}

function displayPageTwo() {
  var boatSelected = document.getElementById("boatSelect");
  var boatText = boatSelected.options[boatSelect.selectedIndex].text;

  var timeSelected = document.getElementById("timeSelect");
  var timeText = timeSelected.options[timeSelect.selectedIndex].text;

  var dateSelected = document.getElementById("bookingDate");
  var dateText = dateSelected.value;

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

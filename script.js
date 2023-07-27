// add the datalist to search
fetch('datalist.html')
  .then(response => response.text())
  .then(text => {
    const datalistInsert = document.getElementById('datalistInsert');
    datalistInsert.innerHTML = text;
  })
  .catch(error => console.log(error));

// Function to handle the search button click
function hyruleSearch() {
  var searchQuery = document.getElementById('searchInput').value;
  var apiUrl = `https://botw-compendium.herokuapp.com/api/v3/compendium/entry/${searchQuery}`;

  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.data.name == null) {
        displayError();
      } else {
        displayResult(data.data);
      }
    })
    .catch(function(error) {
      console.log('Error:', error);
      displayError();
    });
}

// Function to display the API result in the outputCard div
function displayResult(data) {
  var outputCard = document.getElementById('outputCard');
  outputCard.innerHTML = '';

  var cardContent = document.createElement('div');
  cardContent.className = 'outputCard';

  // Create the image element
  var imageElement = document.createElement('img');
  imageElement.src = data.image;
  imageElement.style.display = 'block';
  imageElement.style.margin = '0 auto';
  imageElement.style.border = "1px solid mediumpurple";
  imageElement.style.borderRadius = "10px";
  imageElement.style.boxShadow = "0 0 10px 5px rgba(136, 57, 239, 0.7";
  cardContent.appendChild(imageElement);

  var nameElement = document.createElement('h2');
  nameElement.innerHTML = capitaliseWords(data.name) + ' (#' + data.id + ')';
  cardContent.appendChild(nameElement);

  var infoList = document.createElement('ul');
  infoList.style.listStyle = "none";
  infoList.style.backgroundPosition = "0px 50%";
  infoList.style.paddingLeft = "0px";


    // main list elements
    var categoryItem = document.createElement('li');
    categoryItem.innerHTML = '<b>Category: </b>' + data.category;
    infoList.appendChild(categoryItem);

    var descriptionItem = document.createElement('li');
    descriptionItem.innerHTML = '<b>Description: </b>' + data.description;
    infoList.appendChild(descriptionItem);

    
    var commonLocationsItem = document.createElement('li');
    if (!data.common_locations) {
    commonLocationsItem.innerHTML = "<b>Common Locations:</b> None";
    }
  else {
    commonLocationsItem.innerHTML = "<b>Common Locations: </b>" + commaSpace(data.common_locations);
  }
    infoList.appendChild(commonLocationsItem);

  var dlcItem = document.createElement('li');
  dlcItem.innerHTML = '<b>DLC Item?:</b> ' + data.dlc;
  infoList.appendChild(dlcItem);

  // additional fields
  if (data.category === 'monsters') {

    var dropsItem = document.createElement('li');
    if (data.drops.length == 0 || !data.drops) {
      dropsItem.innerHTML = "<b>Drops: </b> None";
    }
    else {
      dropsItem.innerHTML = "<b>Drops: </b> " + commaSpace(data.drops);
    }
    infoList.appendChild(dropsItem);
    
  }
  else if (data.category === 'equipment') {

    if (data.properties.attack != 0 && data.properties.defense == 0) {
      var atkItem = document.createElement('li');
      atkItem.innerHTML = "<b>Attack: </b> " + data.properties.attack;
      infoList.appendChild(atkItem);
    }
    else if (data.properties.attack == 0 && data.properties.defense != 0) {
      var defItem = document.createElement('li');
      defItem.innerHTML = "<b>Defense: </b> " + data.properties.defense;
      infoList.appendChild(defItem);
    }
  } 
  else if (data.category === 'materials') {

    var heartsRecoveredItem = document.createElement('li');
    var cookingEffectItem = document.createElement('li');
    heartsRecoveredItem.innerHTML = "<b>Hearts Recovered: </b> " + data.hearts_recovered;
    infoList.appendChild(heartsRecoveredItem);

    if (data.cooking_effect == "") {
      cookingEffectItem.innerHTML = "<b>Cooking Effect </b>None";
      infoList.appendChild(cookingEffectItem);
    }
    else {
      cookingEffectItem.innerHTML = "<b>Cooking Effect </b>" + data.cooking_effect;
      infoList.appendChild(cookingEffectItem);
    }
    
  } 
  else if (data.category === 'creatures') {
    if (data.edible == true) { // food 

    var heartsRecoveredItem = document.createElement('li');
    var cookingEffectItem = document.createElement('li');
    heartsRecoveredItem.innerHTML = "<b>Hearts Recovered: </b> " + data.hearts_recovered;
    infoList.appendChild(heartsRecoveredItem);

    if (data.cooking_effect === "") {
      cookingEffectItem.innerHTML = "<b>Cooking Effect </b>None";
      infoList.appendChild(cookingEffectItem);
    }
    else {
      cookingEffectItem.innerHTML = "<b>Cooking Effect </b>" + data.cooking_effect;
      infoList.appendChild(cookingEffectItem);
    } 

    var edibleItem = document.createElement('li');
      edibleItem.innerHTML = "<b>Edible: </b> true";
      infoList.appendChild(edibleItem);
      
    }
    else { // non-food
        var edibleItem = document.createElement('li');
        edibleItem.innerHTML = "<b>Edible: </b> false";
        infoList.appendChild(edibleItem);
    }
  } 
  else if (data.category === 'treasure') {

    var dropsItem = document.createElement('li');
    if (data.drops.length == 0 || !data.drops) {
      dropsItem.innerHTML = "<b>Drops: </b> None";
    }
    else {
      dropsItem.innerHTML = "<b>Drops: </b> " + commaSpace(data.drops);
    }
    infoList.appendChild(dropsItem);
    
  }

  var underlineDiv = document.createElement("div");
  underlineDiv.className = "underline";
  cardContent.appendChild(underlineDiv);

  cardContent.appendChild(infoList);
  outputCard.appendChild(cardContent);
}

// Function to display an error message
function displayError() {
  var searchQuery = document.getElementById('searchInput').value;
  var outputCard = document.getElementById('outputCard');
  outputCard.innerHTML = '';

  var errorMessage = document.createElement('h2');
  errorMessage.innerHTML = `Error: No data found for ${searchQuery}!`;
  errorMessage.style.color = 'red';
  errorMessage.style.textAlign = 'center';

  outputCard.appendChild(errorMessage);
}

// listens for enter keypress to perform search
var searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    hyruleSearch();
  }
}); 


// capitalise every word function with regex 💀
function capitaliseWords(string) {
  return string.replace(/(\b[a-z](?!\b))/g, function(match) {
    return match.toUpperCase();
  });
}

// add a space after every instance of a comma with regex
function commaSpace(string) {
  var inputString = string.toString();
  return inputString.replace(/,/g, ', ');
}


// just a function
function suspiciousFunction() {

  var elements = document.getElementsByTagName("*");

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    // Toggle the marquee class on the element
    element.classList.toggle("marquee");
  }
}

// add the datalist to search
fetch('datalist.html')
  .then(response => response.text())
  .then(text => {
    const datalistInsert = document.getElementById('datalistInsert');
    datalistInsert.innerHTML = text;
  })
  .catch(error => console.log(error));

// Function to handle the search button click
function hyuleSearch() {
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
  cardContent.appendChild(imageElement);

  var nameElement = document.createElement('h2');
  nameElement.textContent = data.name + ' (#' + data.id + ')';
  cardContent.appendChild(nameElement);

  var infoList = document.createElement('ul');
  infoList.style.listStyle = "none";
  infoList.style.backgroundPosition = "0px 50%";
  infoList.style.paddingLeft = "0px";

    // main list elements
    var categoryItem = document.createElement('li');
    categoryItem.textContent = 'Category: ' + data.category;
    infoList.appendChild(categoryItem);

    var descriptionItem = document.createElement('li');
    descriptionItem.textContent = 'Description: ' + data.description;
    infoList.appendChild(descriptionItem);

    
    var commonLocationsItem = document.createElement('li');
    if (!data.common_locations) {
    commonLocationsItem.textContent = "Common Locations: None";
    }
  else {
    commonLocationsItem.textContent = "Common Locations: " + data.common_locations;
  }
    infoList.appendChild(commonLocationsItem);

  var dlcItem = document.createElement('li');
  dlcItem.textContent = 'DLC Item?: ' + data.dlc;
  infoList.appendChild(dlcItem);

  // additional fields
  if (data.category === 'monsters') {

    var dropsItem = document.createElement('li');
    if (data.drops.length == 0 || !data.drops) {
      dropsItem.textContent = "Drops: None";
    }
    else {
      dropsItem.textContent = "Drops: " + data.drops;
    }
    infoList.appendChild(dropsItem);
    
  }
  else if (data.category === 'equipment') {

    if (data.properties.attack != 0 && data.properties.defense == 0) {
      var atkItem = document.createElement('li');
      atkItem.textContent = "Attack: " + data.properties.attack;
      infoList.appendChild(atkItem);
    }
    else if (data.properties.attack == 0 && data.properties.defense != 0) {
      var defItem = document.createElement('li');
      defItem.textContent = "Attack: " + data.properties.attack;
      infoList.appendChild(defItem);
    }
  } 
  else if (data.category === 'materials') {

    var heartsRecoveredItem = document.createElement('li');
    var cookingEffectItem = document.createElement('li');
    heartsRecoveredItem.textContent = "Hearts Recovered: " + data.hearts_recovered;
    infoList.appendChild(heartsRecoveredItem);

    if (data.cooking_effect == "") {
      cookingEffectItem.textContent = "Cooking Effect: None";
      infoList.appendChild(cookingEffectItem);
    }
    else {
      cookingEffectItem.textContent = "Cooking Effect: " + data.cooking_effect;
      infoList.appendChild(cookingEffectItem);
    }
    
  } 
  else if (data.category === 'creatures') {
    if (data.edible == true) { // food 

    var heartsRecoveredItem = document.createElement('li');
    var cookingEffectItem = document.createElement('li');
    heartsRecoveredItem.textContent = "Hearts Recovered: " + data.hearts_recovered;
    infoList.appendChild(heartsRecoveredItem);

    if (data.cooking_effect == "") {
      cookingEffectItem.textContent = "Cooking Effect: None";
      infoList.appendChild(cookingEffectItem);
    }
    else {
      cookingEffectItem.textContent = "Cooking Effect: " + data.cooking_effect;
      infoList.appendChild(cookingEffectItem);
    } 

    var edibleItem = document.createElement('li');
      edibleItem.textContent = "Edible: true";
      infoList.appendChild(edibleItem);
      
    }
    else { // non-food
        var edibleItem = document.createElement('li');
        edibleItem.textContent = "Edible: false";
        infoList.appendChild(edibleItem);
    }
  } 
  else if (data.category === 'treasure') {

    var dropsItem = document.createElement('li');
    if (data.drops.length == 0 || !data.drops) {
      dropsItem.textContent = "Drops: None";
    }
    else {
      dropsItem.textContent = "Drops: " + data.drops;
    }
    infoList.appendChild(dropsItem);
    
  }

  cardContent.appendChild(infoList);
  outputCard.appendChild(cardContent);
}

// Function to display an error message
function displayError() {
  var searchQuery = document.getElementById('searchInput').value;
  var outputCard = document.getElementById('outputCard');
  outputCard.innerHTML = '';

  var errorMessage = document.createElement('h2');
  errorMessage.textContent = `Error: No data found for ${searchQuery}!`;
  errorMessage.style.color = 'red';
  errorMessage.style.textAlign = 'center';

  outputCard.appendChild(errorMessage);
}

// listens for enter keypress to perform search
var searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    hyuleSearch();
  }
});


// just a function
function suspiciousFunction() {

  var elements = document.getElementsByTagName("*");

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    // Toggle the marquee class on the element
    element.classList.toggle("marquee");
  }
}

  


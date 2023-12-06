//VARIABLES

const baseURL = "https://collectionapi.metmuseum.org/public/collection/v1/";

//FUNCTIONS

//function to get all the departments
function getDepartments(parameter) {
  const url = `${baseURL}${parameter}`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      addSelectOptions(data.departments);
    });
}

//function to get artwork by department id
function getArtIdsByDepartment(parameter, departmentId) {
  const url = `${baseURL}${parameter}?departmentIds=${departmentId}`;
  const artItem = {};
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const arr = data.objectIDs;
      const slicedArray = arr.slice(0, 50);
      slicedArray.forEach((i) => {
        return fetch(`${baseURL}objects/${i}`)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            displayArtObject(data);
          });
      });
    });
}

//function get artwork info by objectid
function getArtObjectsBySearch(parameter, search) {
  const url = `${baseURL}${parameter}?q=${search}&hasImages=true`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const arr = data.objectIDs;
      const slicedArray = arr.slice(0, 10);
      slicedArray.forEach((i) => {
        return fetch(`${baseURL}objects/${i}`)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            displayArtObject(data);
          });
      });
    });
}

//get object by Id
function getArtObjectsById(parameter, id) {
  const url = `${baseURL}${parameter}/${id}`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      displayArtObjectFull(data);
    });
}

//function to add departments to select
function addSelectOptions(options) {
  const $departments = $("#departments");
  const $select = $("<select><option>Please Select Department</option>");
  $select.on("change", handleSelect);
  $departments.append($select);
  options.forEach((item) => {
    $select.append(
      `<option value=${item.departmentId}>
          ${item.displayName}</option>`
    );
  });
}

//function to display art object by department
function displayArtObject(options) {
  const $maincontainer = $("#maincontainer");
  const $header = $("#header div");
  $header.css("display", "inline");
  const $artObjects = $("<div>").addClass("artObjects");
  $maincontainer.append($artObjects);
  $artObjects.append(
    `<div class=art>
    <div class=title id=${options.objectID}>${options.title} </div>
    <div>${options.artistDisplayName} </div>
    <div>${options.objectBeginDate}</div>
    <div>Details</div>
    </div>`
  );

  [...document.querySelectorAll(".title")].forEach(function (item) {
    item.addEventListener("click", openObjectModal);
  });
}

//function to display art object full info
function displayArtObjectFull(options) {
  const $objectContainer = $("#objectContainer");
  const $artObject = $("<div>").addClass("artObjectFull");
  $objectContainer.append($artObject);
  $artObject.append(
    `<div class=artwork id=${options.objectID}>
      <div> ${options.title}</div>
      <div>${options.artistDisplayName}</div>
      <div>${options.objectDate}</div>
      <div><a href =${options.objectURL}/> </div>
      <div>${options.department}</div>
      <div> <img src='${options.primaryImageSmall}'></div>

      </div>`
  );
}

//MAIN CODE
getDepartments("departments");
//getArtObjectsById("objects", 436524);

//getArtObjectsBySearch("search", "sunflowers");

// function to handle the select
function handleSelect(event) {
  //get current select values
  const currentValue = event.target.value;
  //fetch the objects
  getArtIdsByDepartment("objects", currentValue);
}

// function to handle the form submission
function handleSubmit(event) {
  //prevent refreshing of the page from the form submision
  event.preventDefault();
  // grab the form from the event
  const form = event.target;
  //create form data obj to access form data
  const formData = new FormData(form);
  //grab the serach param
  const search = formData.get("search");
  //fetch the search results
  getArtObjectsBySearch("search", search);
}

//function to handle object display
function openObjectModal(event) {
  if ($("#objectContainer").css("display") === "none") {
    getArtObjectsById("objects", event.target.id);
    $("#objectContainer").css("display", "inline");
  } else if ($("#objectContainer").css("display") === "inline") {
    $(".artObjectFull").remove();
    $("#objectContainer").css("display", "none");
    getArtObjectsById("objects", event.target.id);
    $("#objectContainer").css("display", "inline");
  }
}

document.querySelector("form").addEventListener("submit", handleSubmit);

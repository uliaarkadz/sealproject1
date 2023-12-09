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
  const $select = $("<select><option value=default>Select Department</option>");
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
  const $artObjects = $("<div>").addClass("artObjects");
  $("#header div").css("display", "block");
  $maincontainer.append($artObjects);

  //handle properties w/o values
  handlleEmptyValues(options);

  //add returned data in the form of table
  $artObjects.append(
    `<div class=art>
    <div class=title id=${options.objectID}>${options.title} </div>
    <div>${options.artistDisplayName} </div>
    <div>${options.objectBeginDate}</div>
    </div>`
  );
  //listener for clciking on any title in the table to display modal with details
  [...document.querySelectorAll(".title")].forEach(function (item) {
    item.addEventListener("click", openObjectModal);
  });
}

//function to display art object full info
function displayArtObjectFull(options) {
  const $objectContainer = $("#modalContent");
  const $artObject = $("<div>").addClass("artObjectFull");
  $objectContainer.append($artObject);

  //handle properties w/o values
  handlleEmptyValues(options);

  //display detailed object content
  $artObject.append(
    `<div class=artwork id=${options.objectID}>
      <div> ${options.title}</div>
      <div>${options.artistDisplayName}</div>
      <div>${options.objectDate}</div>
      <div><a href =${options.objectURL} target=_blank/> </div>
      <div>${options.department}</div>
      <div> <img src=${options.primaryImageSmall} target=_blank></div>
      </div>`
  );
}

//handle properties w/o values
function handlleEmptyValues(options) {
  for (var key in options) {
    if (options[key] == "" || options[key] == null) {
      options[key] = "unknown";
    }
  }
}

//MAIN CODE

//load deprtments
getDepartments("departments");

// function to handle the select
function handleSelect(event) {
  //get current select values
  let currentValue;

  //check if the objects are displayed if yes - clear the data and elements first
  if ($(".artObjects").length == 0) {
    currentValue = event.target.value;
  } else {
    $(".artObjects").remove();
    $("#header div").css("display", "none");
    currentValue = event.target.value;
  }

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

  //grab the search param
  //check if the objects are displayed if yes - clear the data and elements first
  let search;
  if ($(".artObjects").length == 0) {
    search = formData.get("search");
  } else {
    $(".artObjects").remove();
    $("#header div").css("display", "none");
    search = formData.get("search");
  }

  //fetch the search results
  getArtObjectsBySearch("search", search);
}

//function to handle object display in modal
function openObjectModal(event) {
  if ($(".modal").css("display") === "none") {
    getArtObjectsById("objects", event.target.id);
    $("#myModal").css("display", "block");
  }
}

//hide or show departments select
function showDepartmentsSelect() {
  if ($(".artObjects").length == 0) {
    $("#departments").css("display", "flex");
    $("#search").css("display", "none");
    $("select").val("default");
    $("#info").css("display", "none");
  } else {
    $(".artObjects").remove();
    $("#departments").css("display", "flex");
    $("#search").css("display", "none");
    $("#header div").css("display", "none");
    $("input").val("");
    $("select").val("default");
  }
}

//hide or show serach input
function showSearchInput() {
  if ($(".artObjects").length == 0) {
    $("input").val("");
    $("#search").css("display", "flex");
    $("#departments").css("display", "none");
    $("#info").css("display", "none");
  } else {
    $(".artObjects").remove();
    $("#search").css("display", "flex");
    $("#departments").css("display", "none");
    $("#header div").css("display", "none");
    $("select").val("0");
    $("input").val("");
  }
}

//function handle close modal
function closeMOdal(event) {
  $("#myModal").css("display", "none");
  $(".artObjectFull").remove();
}

// clicks anywhere outside of the modal, close it
function closeModalWhenClickedAnywhere(event) {
  if ($(event.target) == $("#myModal")) {
    $("#myModal").css("display", "none");
    $(".artObjectFull").remove();
  }
}

//listen when user submits form
document.querySelector("form").addEventListener("submit", handleSubmit);

//show departnments select
document
  .querySelector("#searchart")
  .addEventListener("click", showDepartmentsSelect);

//show search input
document.querySelector("#find").addEventListener("click", showSearchInput);

// Get the <span> element that closes the modal
document
  .getElementsByClassName("close")[0]
  .addEventListener("click", closeMOdal);

//close modal
window.addEventListener("click", closeModalWhenClickedAnywhere);

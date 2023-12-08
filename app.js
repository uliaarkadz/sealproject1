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
  const $select = $("<select><option>Select Department</option>");
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
  for (var key in options) {
    if (options[key] == "") {
      options[key] = "not availabele";
    }
  }
  $artObjects.append(
    `<div class=art>
    <div class=title id=${options.objectID}>${options.title} </div>
    <div>${options.artistDisplayName} </div>
    <div>${options.objectBeginDate}</div>
    </div>`
  );

  [...document.querySelectorAll(".title")].forEach(function (item) {
    item.addEventListener("click", openObjectModal);
  });
}

//function to display art object full info
function displayArtObjectFull(options) {
  const $objectContainer = $("#modalContent");
  const $artObject = $("<div>").addClass("artObjectFull");
  $objectContainer.append($artObject);
  for (var key in options) {
    if (options[key] == "" || options[key] == null) {
      options[key] = "not availabele";
    }
  }
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

//MAIN CODE
getDepartments("departments");

// function to handle the select
function handleSelect(event) {
  //get current select values
  let currentValue;
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
  //grab the serach param
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

//function to handle object display
function openObjectModal(event) {
  if ($(".modal").css("display") === "none") {
    getArtObjectsById("objects", event.target.id);
    $("#myModal").css("display", "block");
  }
}

function showDepartmentsSelect() {
  if ($(".artObjects").length == 0) {
    $("#departments").css("display", "flex");
    $("#search").css("display", "none");
  } else {
    $(".artObjects").remove();
    $("#departments").css("display", "flex");
    $("#search").css("display", "none");
    $("#header div").css("display", "none");
  }
}

function showSearchInput() {
  if ($(".artObjects").length == 0) {
    $("#search").css("display", "flex");
    $("#departments").css("display", "none");
  } else {
    $(".artObjects").remove();
    $("#search").css("display", "flex");
    $("#departments").css("display", "none");
    $("#header div").css("display", "none");
  }
}
//function handle close modal
function closeMOdal(event) {
  $("#myModal").css("display", "none");
  $(".artObjectFull").remove();
}
// When the user clicks anywhere outside of the modal, close it
function closeModalWhenClickedAnywhere(event) {
  if ($(event.target) == $("#myModal")) {
    $("#myModal").css("display", "none");
    $(".artObjectFull").remove();
  }
}

document.querySelector("form").addEventListener("submit", handleSubmit);

document
  .querySelector("#searchart")
  .addEventListener("click", showDepartmentsSelect);

document.querySelector("#find").addEventListener("click", showSearchInput);

// Get the <span> element that closes the modal
document
  .getElementsByClassName("close")[0]
  .addEventListener("click", closeMOdal);

window.addEventListener("click", closeModalWhenClickedAnywhere);

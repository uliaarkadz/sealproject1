//VARIABLES

//let museumDepartments = [];
const artObjectIds = [];
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
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const arr = data.objectIDs;
      const slicedArray = arr.slice(0, 50);
      displayDepartmentArtObject(slicedArray);
    });
}

//function get artwork info by objectid

function getArtOblectInfo(parameter, objectId) {
  const url = `${baseURL}${parameter}/${objectId}`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
    });
}

//function to add departments to select
function addSelectOptions(options) {
  const $departments = $("#departments");
  const $select = $("<select>");
  $departments.append($select);
  options.forEach((item) => {
    $select.append(
      `<option value=${item.departmentId}>
          ${item.displayName}</option>`
    );
  });
}
//function to display art object by department

function displayDepartmentArtObject(options) {
  const $maincontainer = $("#maincontainer");
  const $artObjects = $("<div>").addClass("artObjects");
  $maincontainer.append($artObjects);
  options.forEach((item) => {
    $artObjects.append(`<div class=art id =${item}></div></div>`);
  });
  artWorkDetail();
}

//function get object info
function artWorkDetail(itemData) {
  const $divArtItem = $(".art");
  var ids = $divArtItem.map(function () {
    return $(this).attr("id");
  });
  ids.forEach((i) => {});
}
//MAIN CODE
getDepartments("departments");
getArtIdsByDepartment("objects", 1);

//displayDepartmentArtObject();

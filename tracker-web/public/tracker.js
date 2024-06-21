// function to sort the results of form
function sortAndProcess(pairs) {
  // Sort the array of tuples based on the second item (value)
  const sortedPairs = pairs.sort((a, b) => b[1] - a[1]);

  // Store the results in an object
  const result = {};
  sortedPairs.forEach(pair => {
      result[pair[0]] = pair[1];
  });

  return result;
}

// Create tracker form element
let formElement = document.getElementById("container-form");
for (let i =1; i <= 5; i++){
  // containers
  let main_div = document.createElement('div');
  main_div.className = "row mb-3";

  let input_div = document.createElement('div');
  input_div.className = "col-sm-3";

  // make label
  let label = document.createElement('label');
  label.innerText = "Tracker " + i;
  label.htmlFor = "tracker_" + i;
  label.className = "col-sm-9 col-form-label";
  // make text box
  let input = document.createElement('input');
  input.type = "text";
  input.name = "tracker_" + i;
  input.id = "tracker_" + i;
  input.className = "form-control";
  // append label and text box to form element
  main_div.appendChild(label);
  main_div.appendChild(input_div);
  input_div.appendChild(input);
  formElement.appendChild(main_div);
}

// Form logic

const socket = io();

document.getElementById('form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Create an object to hold the form data
  const formData = new FormData(event.target);
  const formObject = {};

  formData.forEach((value, key) => {
      formObject[key] = parseFloat(value) || value; // Convert to number if possible
  });

  // Convert the form object to an array of pairs
  const pairs = Object.entries(formObject);

  // Sort and process the form data
  const result = sortAndProcess(pairs);

  console.log(result);
  
  socket.emit('form', result);
});
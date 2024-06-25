// function to sort the results of form
function sortAndProcess(pairs) {
  // Sort the array of tuples based on the second item (value)
  const sortedPairs = pairs.sort((a, b) => b[1] - a[1]);
  return sortedPairs;
};

// logic to display the sorted trackers
function displayTrackers(pairs) {
  // Get the container element
  const container = document.getElementById('container-results');
  // Clear the container
  container.innerHTML = '';
  // Iterate through each pair and create HTML elements
  pairs.forEach(pair => {
      const [key, value] = pair;
      // Create a new div element
      const div = document.createElement('div');
      div.id = `item-${key}`;
      // Create a new paragraph element for the key
      const itemElement = document.createElement('p');
      itemElement.textContent = `Key: ${key} | Value: ${value}`;
      // Append the key and value elements to the div
      div.appendChild(itemElement);
      // Append the div to the container
      container.appendChild(div);
  });
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// logic to send data to trackers
async function sendTrackers(pairs){
  for (const pair of pairs) {
    const [key, value] = pair;
    // Send it to the server via websocket
    socket.emit('trackerData', pair);

    // highlight the div containing this item
    let div = document.getElementById(`item-${key}`)
    div.style.backgroundColor = 'yellow';

    await delay(10000);
    div.style.backgroundColor = '';
  };
};

// Create tracker form element
let formElement = document.getElementById("container-form");
for (let i =1; i <= 5; i++){
  // containers
  let main_div = document.createElement('div');
  main_div.className = "row mb-3 text-end";
  if (i == 5){
    main_div.className = "row text-end";
  }

  let input_div = document.createElement('div');
  input_div.className = "col-sm-3";

  // make label
  let label = document.createElement('label');
  label.innerText = "Tracker " + i;
  label.htmlFor = "tracker_" + i;
  label.className = "col-sm-6 col-form-label";
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
  // unhide results div
  let results_div = document.getElementById('container-results');
  results_div.classList.remove('d-none');
  // Create an object to hold the form data
  const formData = new FormData(event.target);
  const formObject = {};

  formData.forEach((value, key) => {
      formObject[key] = parseFloat(value) || value; // Convert to number if possible
  });

  // Convert the form object to an array of pairs
  const pairs = Object.entries(formObject);

  // Sort and process the form data
  const sortedPairs = sortAndProcess(pairs);

  // show the sorted trackers
  displayTrackers(sortedPairs);

  // send the sorted trackers to serial
  sendTrackers(sortedPairs);

});
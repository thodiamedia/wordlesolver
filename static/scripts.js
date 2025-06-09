function getFmt() {
  return [1, 2, 3, 4, 5]
    .map(i => document.getElementById(`matcher-${i}`).value)
    .map(val => {
      // clean the input
      if (val.length === 0) {
        return '';
      }

      val = val.toLowerCase();
      val = val.replace(/[^a-z]/g, '');
      
      return val.length === 0 ? '' : val[0];
    });
}

function getExcluded() {
  let val = document.getElementById('exclude').value;
  val = val.toLowerCase();
  val = val.replace(/[^a-z]/g, '');
  return val.split('');
}

/** Submit a search and displays results */
function submitSearch() {
  const fmt = getFmt();
  const excluded = getExcluded();

  fetch('/wordle', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fmt, excluded })
    })
      .then(response => response.json())
      .then(data => showResults(data.results))
      .catch(err => {
        console.error(err);
        displayError('There was likely an error in your Python code. Please check for error messages in the Repl console.');
      });
}

function showResults(results) {
  console.log(results);
  // remove all previous results
  const output = document.getElementById('output');
  while (output.firstChild) {
    output.removeChild(output.firstChild);
  }

  // display results
  results.forEach(result => {
    const resultElement = document.createElement('span');
    resultElement.innerText = result;
    output.appendChild(resultElement);
  });

  // display length error if necessary
  if (results.length === 0) {
    displayError('There are no words that match this criteria. Please double-check your inputs.')
  }
}

/** Displays an error message to the user */
function displayError(message, keepPreviousOutput) {
  // remove all previous output
  const output = document.getElementById('output');
  if (!keepPreviousOutput) {
    while (output.firstChild) {
      output.removeChild(output.firstChild);
    }
  }

  // display error
  const errorElement = document.createElement('span');
  errorElement.classList.add('error')
  errorElement.innerText = message;
  output.appendChild(errorElement);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search').addEventListener('click', submitSearch);
});

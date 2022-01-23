const MAX_RESULTS = 400;
const OUTPUT_SCROLL_THRESHOLD = 0.8;
ALLOWED_PATHS = ['4', '6', '7', '8']

/** Get number of characters based on path */
const path = window.location.pathname.replaceAll('/', '');
const numCharsPath = ALLOWED_PATHS.includes(path) ? parseInt(path) : 5;

let wordList;

 /** Download and decompress word list */
function loadWordList(fileUrl) {
  console.log(`Getting word list from ${fileUrl}`);
  fetch(fileUrl)
    .then(response => response.text())
    .then(data => {
      wordList = atob(data).split(',')
      console.log(`Got word list with ${wordList.length} words`);
    })
    .catch(error => {
      console.error(error);
      displayError('There was a problem loading the word dictionary. Please refresh the page to try again.');
    });
}

/**
 * Get arrays of words which match the provided criteria
 * @param {string} matchStr Regex for matching
 * @param {string[]} includeList Array of characters which must be included in the word, if provided
 * @param {string[][]} excludeLists Array of arrays of characters which must be excluded at each position
 * @returns Array of matching words
 */
function getMatchingWords(matchStr, includeList, excludeLists) {
  console.log('getMatchingWords', matchStr, JSON.stringify(excludeLists));
  const matchRegex = new RegExp(matchStr);
  return wordList
    // filter to words which match the matchStr
    .filter(word => matchRegex.test(word))
    // filter to words where no character is in the excludeList  
    .filter(word => word.split('').every((char, idx) => excludeLists[idx].every(excludedChar => excludedChar !== char)))
    // filter to words that contain all in the includeList, if provided
    .filter(word => includeList.length === 0 || includeList.every(char => word.includes(char)));
}

/** Return list of valid lower-case characters from input string */
function toLowerSplit(inputStr) {
  return inputStr
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .split('');
}

/** Submit a search and displays results */
function submitSearch() {
  // update footer float after redraw
  setTimeout(updateFooterFloat, 1);

  if (!wordList) {
    displayError('We are still loading the word dictionary, please try searching again');
    return;
  }

  let matchInput = '';
  const includeList = [];
  const excludeLists = [];
  for (let i = 0; i < numCharsPath; i++) {
    excludeLists.push([]);
  }

  cleanAllInputs();

  // green tiles - set up regex
  forEachMultiInputContainer('matcher', matcherInput => matchInput += matcherInput.value);
  matchInput = matchInput.toLowerCase().replaceAll('?', '.');

  // yellow tiles - add to include list and specific exclude lists
  forEachMultiInputContainer('includer', (includerInput, index) => {
    excludeLists[index].push(...toLowerSplit(includerInput.value))
    includeList.push(...toLowerSplit(includerInput.value));
  });

  // gray tiles - add to all exclude lists
  const excludeInput = toLowerSplit(document.getElementById('exclude').value);
  excludeLists.forEach(excludeList => excludeList.push(...excludeInput));

  // get results
  let results = getMatchingWords(
    matchInput,
    includeList,
    excludeLists
  );

  // remove all previous results
  const output = document.getElementById('output');
  while (output.firstChild) {
    output.removeChild(output.firstChild);
  }

  // limit number of results to display if necessary
  let lengthError;
  if (results.length > MAX_RESULTS) {
    lengthError = `Excluded ${results.length - MAX_RESULTS} additional results.`;
    const interval = Math.round(results.length / MAX_RESULTS);
    results = results.filter((_, index) => index % interval == 0);
  }

  // display results
  results.slice(0, MAX_RESULTS).forEach(result => {
    const resultElement = document.createElement('span');
    resultElement.innerText = result;
    output.appendChild(resultElement);
  });

  // display length error if necessary
  if (results.length === 0) {
    displayError('There are no words that match this criteria. Please double-check your inputs.')
  }
  if (lengthError) {
    displayError(lengthError, true);
  }

  // scroll to output section if it is low enough on screen
  const outputTopPos = output.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;
  if (outputTopPos >= windowHeight * OUTPUT_SCROLL_THRESHOLD) {
    output.scrollIntoView({ 'behavior': 'smooth' });
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

/** Update the footer's floating state depending on whether it would block page content */
function updateFooterFloat() {
  const footer = document.getElementById('footer');
  const footerMarker = document.getElementById('footer-marker');

  const windowHeight = window.innerHeight;
  const footerHeight = footer.getBoundingClientRect().height + 0.1 * windowHeight;
  const footerMarkerPosition = footerMarker.getBoundingClientRect().top;

  if (footerMarkerPosition + footerHeight > windowHeight) {
    footer.classList.remove('floating');
  }
  else {
    footer.classList.add('floating');
  }
}

/** Shift focus among matcher input elements */
function shiftFocus(currInput, diff) {
  const currInputIndex = parseInt(currInput.id.split('-')[1]);
  const desiredInputIndex = currInputIndex + diff;

  if (desiredInputIndex < 1 || desiredInputIndex > 5) {
    return null;
  }

  const desiredElement = document.getElementById(`matcher-${desiredInputIndex}`);
  desiredElement.focus();
  desiredElement.select();
  return desiredElement;
}

/** Clean inputs in all multi-input elements */
function cleanAllInputs() {
  ['matcher', 'includer'].forEach(prefix => {
    // generate list with values [1, 2, 3 ... numCharsPath]
    [...Array(numCharsPath).keys()]
      .map(v => v + 1)
      .forEach(index => cleanMultiInput(prefix, index));
  });
  document.getElementById('exclude').value = getCleanInput('exclude');
}

/** Clean inputs in specific multi-input element */
function cleanMultiInput(prefix, index, suppressWildcardTranslation) {
  const inputElement = document.getElementById(index !== undefined ? `${prefix}-${index}` : prefix);
  inputElement.value = getCleanInput(prefix, index, suppressWildcardTranslation);
}

/** Get clean value for excluder element */
function getCleanInput(prefix, index, suppressWildcardTranslation) {
  const isMatcher = prefix === 'matcher';
  const isIncluder = prefix === 'includer';
  const isExclude = prefix === 'exclude';
  const inputElement = document.getElementById(index !== undefined ? `${prefix}-${index}` : prefix);
  let value = inputElement.value;

  if (isMatcher) {
    if (value === '') {
      value = '?';
    }
    if (/[a-z]/.test(value)) {
      value = value.toUpperCase();
    }
    if (!suppressWildcardTranslation && !/[A-Za-z?]/.test(value)) {
      value = '?';
    }
  }
  else if (isIncluder) {
    value = value.toUpperCase().replace(/[^A-Z]/g, '');
  }
  else if (isExclude) {
    value = value.toUpperCase().replace(/[^A-Z]/g, '');
  }

  return value;
}

/** Execute the provided function for each input in the multi-input container */
function forEachMultiInputContainer(prefix, func) {
  // generate list with values [1, 2, 3 ... numCharsPath]
  [...Array(numCharsPath).keys()]
    .map(v => v + 1)
    .map(i => document.getElementById(`${prefix}-${i}`))
    .forEach(func);
}

function setupMultiInputContainerListers(prefix) {
  const isMatcher = prefix === 'matcher';
  const isIncluder = prefix === 'includer';

  forEachMultiInputContainer(prefix, (inputElement, index) => {
    // left/right arrow keys should move between inputs
    inputElement.addEventListener('keyup', e => {
      if (isMatcher && e.key === 'ArrowLeft') {
        e.preventDefault();
        shiftFocus(inputElement, -1);
      }
      if (isMatcher && e.key === 'ArrowRight') {
        e.preventDefault();
        shiftFocus(inputElement, 1);
      }
      if (isIncluder) {
        cleanMultiInput(prefix, index + 1);
      }
    });

    inputElement.addEventListener('keydown', e => {
      if (isIncluder) {
        return;
      }

      let translatedKeyValue = null;

      // do not input invalid characters
      if (!/[A-Za-z?]/.test(e.key)) {
        translatedKeyValue = '';
      }

      // convert to uppercase
      if (e.key.length === 1 && /[a-z]/.test(e.key)) {
        translatedKeyValue = e.key.toUpperCase();
      }

      // update current field with translated input
      if (translatedKeyValue !== null && inputElement.selectionStart === 0) {
        inputElement.value = translatedKeyValue;
        e.preventDefault();
        return;
      }

      if (isIncluder) {
        return;
      }

      // update next field with current or translated input
      if (
        // if input is valid or translated:
        ((translatedKeyValue !== null && translatedKeyValue !== '')
        || (e.key.length === 1 && /[A-Za-z?]/.test(e.key)))
        // if selection is at end of current textbox:
        && inputElement.selectionStart === 1
      ) {
        const newFocusedInput = shiftFocus(inputElement, 1);
        if (newFocusedInput !== null) {
          newFocusedInput.value = translatedKeyValue;
        }
      }
    });
    if (isMatcher) {
      inputElement.addEventListener('click', e => e.target.select());
      inputElement.addEventListener('focus', e => e.target.select());
    }

     // prevent clicking with mac touchpad always resulting in right-click
     inputElement.addEventListener('contextmenu', e => e.preventDefault());
  });
}

/** Set up with desired number of characters */
function setupWithNumChars(numChars) {
  console.log(`Setting up wordle with ${numChars} characters`);
  loadWordList(`/data/words-${numChars}ch.b64.txt`)
  document.body.classList.add(`words-${numChars}ch`)
}

/** Set listeners */
function setupListeners() {
  document.getElementById('search').addEventListener('click', submitSearch);
  window.addEventListener('resize', updateFooterFloat);
  window.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
      // search when enter is pressed
      e.preventDefault();
      submitSearch();
    }
  });
  setupMultiInputContainerListers('matcher');
  setupMultiInputContainerListers('includer');
  document.getElementById('exclude').addEventListener('keyup', e => {
    cleanMultiInput('exclude');
  });
  document.getElementById('menu-btn').addEventListener('click', () => document.body.classList.toggle('show-nav'));
}

document.addEventListener('DOMContentLoaded', () => {
  setupWithNumChars(numCharsPath);
  setupListeners();
  updateFooterFloat();
});

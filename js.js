console.log("connected")

/* Для тегов на игроках */
function checkPlayers() {

  /*========Make the player name copyable========*/
  const playerDivs = document.querySelectorAll('._name_ipfwp_66');

  playerDivs.forEach((playerDiv) => {
    const playerName = playerDiv.textContent.trim();

    // Make the player name copyable
    playerDiv.style.cursor = 'pointer';
    playerDiv.addEventListener('click', function () {
      var textarea = document.createElement('textarea');
      textarea.value = playerName;

      document.body.appendChild(textarea);

      textarea.select();

      document.execCommand('copy');

      document.body.removeChild(textarea);

      playerDiv.style.backgroundColor = '#d3ffd3';

      setTimeout(function () {
        playerDiv.style.backgroundColor = '';
      }, 1000);
    });

    // Check and assign player lists
    for (const [listName, playersInList] of Object.entries(lists)) {
      const player = playersInList.find((player) => player.name === playerName);
      if (player) {
        const existingTag = playerDiv.parentNode.querySelector(
          `.tag.${listName}`
        );
        if (!existingTag) {
          playerDiv.classList.add(listName);
          const span = document.createElement('span');
          span.classList.add('tag', listName);
          span.textContent = listName;
          span.title = player.comment; // Assigning comment as title
          playerDiv.parentNode.appendChild(span); // Append span as sibling
        }
        break; // Exit the loop once a match is found
      } else {
        playerDiv.classList.remove(listName);
      }
    }
  });
}

/* Для цветовой градации на handNames */
function assignHandNameClasses() {
  const handNames = document.querySelectorAll("div[data-type='hand-name']");

  handNames.forEach((handNameDiv) => {
    const handName = handNameDiv.textContent.trim().toLowerCase();

    // Handle specific cases for "High Card" and "pair"
    if (handName === 'high card') {
      handNameDiv.classList.add('high-card');
    } else {
      // Replace spaces with hyphens for multi-word hand names
      const normalizedHandName = handName.replace(/\s+/g, '-');
      handNameDiv.classList.add(normalizedHandName);
    }
  });
}

/* Для копирования аватаров */
function setupAvatarClickCopy() {
  // Select all avatar elements
  var avatarElements = document.querySelectorAll('._avatar_1wtry_1');

  // Attach click event listener to each avatar element
  avatarElements.forEach(function (avatarElement) {
    avatarElement.addEventListener('click', function () {
      var backgroundImage = avatarElement.style.backgroundImage;
      var imageUrl = backgroundImage.match(/url\("(.+)"\)/)[1];

      navigator.clipboard.writeText(imageUrl).catch(function (error) {
        console.error('Unable to copy avatar link: ', error);
      });
    });
  });
}

/*======= Для фолда средней клавишей мыши + фокус на ставке, когда ставим =======*/
// Function to focus on the input element
function focusInputElement() {
  // Find the input element by its class name
  var inputElement = document.querySelector('._bet__input_21mb1_198');

  // If the input element exists
  if (inputElement) {
    // Focus on the input element
    inputElement.focus();
  }
}

// Function to handle middle mouse button clicks
function handleMiddleMouseClick(event) {
  if (event.button === 1 && !buttonClicked) {
    // middle mouse button
    // Check/fold button if available
    const checkFoldButton = document.querySelector(
      'button[data-action="check-fold"]'
    );
    if (checkFoldButton && !checkFoldButton.disabled) {
      console.log('Check/fold button clicked');
      checkFoldButton.click();
      buttonClicked = true;
      return;
    }

    // Check button if available
    const checkButton = document.querySelector('button[data-action="check"]');
    if (checkButton && !checkButton.disabled) {
      console.log('Check button clicked');
      checkButton.click();
      buttonClicked = true;
      return;
    }

    // Fold button if available
    const foldButton = document.querySelector('button[data-action="fold"]');
    if (foldButton) {
      console.log('Fold button clicked');
      foldButton.click();
      buttonClicked = true;
    }
  }
}

// Function to reset buttonClicked flag after mouseup
function resetButtonClicked(event) {
  if (event.button === 1) {
    // middle mouse button
    buttonClicked = false;
  }
}

// Create a MutationObserver instance for input element
var inputObserver = new MutationObserver(function (mutationsList, observer) {
  // For each mutation
  for (var mutation of mutationsList) {
    // If nodes have been added
    if (mutation.type === 'childList') {
      // Run the function to focus on the input element when it appears
      focusInputElement();
    }
  }
});

// Start observing mutations for the input element
inputObserver.observe(document.body, { childList: true, subtree: true });

// Flag to track if a button has already been clicked
var buttonClicked = false;

// Listen for middle mouse button clicks
document.addEventListener('mousedown', handleMiddleMouseClick);

// Reset buttonClicked flag after mouseup
document.addEventListener('mouseup', resetButtonClicked);

/*__________________________________________________________________________*/

/*=======Отображаем pot size и фракцинные размеры ставок=========*/

// Function to calculate pot size including bets made during the current stage
function calculatePotSize() {
  let potSize = 0;

  // Get pot size
  const potElements = document.querySelectorAll(
    'div._pot_30950_8 span._text_iqb9w_1'
  );
  if (potElements.length > 0) {
    const potSizeText = potElements[potElements.length - 1].textContent.trim(); // Select the last pot size element if there are multiple
    potSize = parseFloat(potSizeText) || 0; // Handle NaN case
  }

  // Get bets made during the current stage and add them to the pot size
  const betElements = document.querySelectorAll(
    'div[data-type="chip"][data-chip="bet"]'
  );
  betElements.forEach((element) => {
    const betAmountText = element.textContent.trim();
    const betAmount = parseFloat(betAmountText);
    potSize += betAmount || 0; // Handle NaN case
  });

  return potSize;
}

// Function to display pot size and fractions of the pot size within a parent div
function displayPotSize() {
  try {
    // Calculate pot size
    const potSize = calculatePotSize();

    // Round pot size conditionally
    let roundedPotSize;
    if (potSize < 50) {
      roundedPotSize = potSize.toFixed(1); // Round to one decimal place
    } else {
      roundedPotSize = Math.round(potSize); // Round to the nearest whole number
    }

    // Calculate fractions of the pot size with the same rounding rule
    const oneFourthPotSize = Math.round((potSize / 4) * 10) / 10; // Round to one decimal place
    const oneThirdPotSize = Math.round((potSize / 3) * 10) / 10; // Round to one decimal place
    const halfPotSize = Math.round((potSize / 2) * 10) / 10; // Round to one decimal place
    const twoThirdPotSize = Math.round((potSize / 3) * 2 * 10) / 10; // Round to one decimal place
    const threeFourthPotSize = Math.round((potSize / 4) * 3 * 10) / 10; // Round to one decimal place
    const oneTwentyFifthPotSize = Math.round(potSize * 1.25 * 10) / 10; // Round to one decimal place
    const oneFiftyPotSize = Math.round(potSize * 1.5 * 10) / 10; // Round to one decimal place

    // Create or update pot calculation container
    let potCalcContainer = document.getElementById('potCalc');
    if (!potCalcContainer) {
      potCalcContainer = document.createElement('div');
      potCalcContainer.id = 'potCalc';
      document.body.appendChild(potCalcContainer);
    }

    // Create or update pot size element
    let potSizeElement = document.getElementById('potSize');
    if (!potSizeElement) {
      potSizeElement = document.createElement('div');
      potSizeElement.id = 'potSize';
      potCalcContainer.appendChild(potSizeElement);
      // Add class "potCalcContainerElement" to pot size element
      potSizeElement.classList.add('potCalcContainerElement');
    }
    potSizeElement.textContent = 'Pot size: ' + roundedPotSize;

    // Update or create span elements for each fraction
    updateFractionElement(
      potCalcContainer,
      'oneFourthPotSize',
      '1/4: ',
      oneFourthPotSize
    );
    updateFractionElement(
      potCalcContainer,
      'oneThirdPotSize',
      '1/3: ',
      oneThirdPotSize
    );
    updateFractionElement(
      potCalcContainer,
      'halfPotSize',
      '1/2: ',
      halfPotSize
    );
    updateFractionElement(
      potCalcContainer,
      'twoThirdPotSize',
      '2/3: ',
      twoThirdPotSize
    );
    updateFractionElement(
      potCalcContainer,
      'threeFourthPotSize',
      '3/4: ',
      threeFourthPotSize
    );
    updateFractionElement(
      potCalcContainer,
      'oneTwentyFifthPotSize',
      '125%: ',
      oneTwentyFifthPotSize
    );
    updateFractionElement(
      potCalcContainer,
      'oneFiftyPotSize',
      '150%: ',
      oneFiftyPotSize
    );
  } catch (error) {
    console.error('Error displaying pot size:', error);
  }
}

// Function to update or create a fraction of pot size element
function updateFractionElement(container, id, label, value) {
  let fractionElement = document.getElementById(id);
  if (!fractionElement) {
    fractionElement = document.createElement('div');
    fractionElement.id = id;
    container.appendChild(fractionElement);
  }
  fractionElement.textContent = label + value;
  // Add class "potCalcContainerElement" to fraction elements
  fractionElement.classList.add('potCalcContainerElement');
}

// Callback function to handle mutations
function mutationCallback(mutationsList, observer) {
  try {
    // Recalculate and display pot size whenever mutations occur
    displayPotSize();
  } catch (error) {
    console.error('Error handling mutations:', error);
  }
}

// Create a MutationObserver instance
const observer = new MutationObserver(mutationCallback);

// Start observing mutations for the betting options container
observer.observe(document.body, { childList: true, subtree: true });

/*_____________________________________________________*/

/* Функция, чтобы ранить другие функции */
function runEveryFewSeconds(functionsToRun) {
  setInterval(() => {
    functionsToRun.forEach((functionToRun) => {
      functionToRun();
    });
  }, 2000);
}

runEveryFewSeconds([checkPlayers, assignHandNameClasses, setupAvatarClickCopy]);

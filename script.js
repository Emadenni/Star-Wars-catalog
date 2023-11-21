

let firstClick = true;

function startAudio() {
  let audio = document.getElementById('starWarsTheme');
  
  if (firstClick) {
    audio.style.display = "inline";
    audio.play();
    firstClick = false;
  }
}

async function playLaserSound() {
  let laserSound = document.getElementById('laserSound');
  laserSound.play();
}
/*-------------------------Main function/event + variables-------------------------------------- */
document.addEventListener("DOMContentLoaded", async function () {
  
  spinner2.style.display = "none";
  spinner3.style.display = "none";
  const charactersList = document.getElementById("charactersList");
  const planetInfoList = document.getElementById("planetInfoList");
  const infoList = document.getElementById("infoList");
  const showNextButton = document.getElementById("right");
  const showPreviousButton = document.getElementById("left");
  let pageCounter = document.querySelector(".pageCounter");
  const charactersTitle = document.getElementById("charactersTitle");
  const loadingSpinner = document.getElementById("spinner");
  const loadingSpinner2 = document.getElementById("spinner2");
  const loadingSpinner3 = document.getElementById("spinner3");
  let currentPage = 1;
  const totalPages = 8;
  const charactersPerPage = 6;
  const classPattern = ["type1", "type2", "type3", "type2", "type1", "type2"]; // Il pattern di classi
  const infoBox = document.querySelector(".infoBox");
  const planetInfo = document.querySelector(".planetInfo");

  /*---------------------------Function to update pages counter--------------------------------- */
  function updatePageCounter() {
    pageCounter.innerText = `${currentPage} / ${totalPages}`;
  }

  /*---------------------------Getting characters from API--------------------------------- */
  
  async function fetchCharacters() {
    try {
      const response = await fetch(`https://swapi.dev/api/people/`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error during the API request:", error);
      return [];
    }
  }
  /*--------------------Function to manage the classes-pattern-array using the index------------ */
  function getClassByIndex(index) {
    return classPattern[index % classPattern.length];
  }
  /*------------------------Function to use and show characters--------------------------------- */
  async function showCharacters() {
   
    spinner.style.display = "block";
    const characters = await fetchCharacters();
    //Ex. page 1 start-index = 0 end-index 6;
    //Ex. page 2 start-index = 6 end-index 12;
    //Ex. page 3 start-index = 12 end-index 18;...
    const startIndex = (currentPage - 1) * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    //Make empty the list  to fill it with new datas;
    charactersList.innerHTML = "";
    //Looping and cutting the array and creating elements to refill with datas;
    characters.slice(startIndex, endIndex).forEach((character, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = character.name;
      //Calling the function for apply class-array pattern and applying classes
      const listItemClass = getClassByIndex(index);
      listItem.classList.add("listItem", listItemClass);
      charactersList.appendChild(listItem);
    });

    /*-------------------------------Creation of empty slots--------------------------------- */
    const remainingEmptySlots =
      charactersPerPage - characters.slice(startIndex, endIndex).length; //Calulates num of empty slots that needs
    for (let i = 0; i < remainingEmptySlots; i++) {
      //Loop to create empty slots
      const emptyListItem = document.createElement("li");
      const emptyListItemClass = getClassByIndex(endIndex + i); //Associating new class to classes-pattern
      emptyListItem.classList.add("listItem", emptyListItemClass, "emptySlot");
      emptyListItem.textContent = "Empty";
      charactersList.appendChild(emptyListItem);
    }

    /*-------------------------------Showing/hiding elements--------------------------------- */
    spinner.style.display = "none";
    showNextButton.style.display = "inline";
    showPreviousButton.style.display = "inline";
    charactersTitle.style.display = "block";
    updatePageCounter();
  }
  /*------------------------------Create event lister on the characters items-------------------------------- */
  charactersList.addEventListener("click", async (event) => {
    startAudio();

    const clickedElement = event.target;
    spinner2.style.display = "block";
    spinner3.style.display = "block";

    if (clickedElement.tagName === "LI") {
        // Remove the arrow from the already used elements
        const listItems = charactersList.querySelectorAll("li");
        listItems.forEach((item) => {
            item.textContent = item.textContent.replace(" ▷", "");
        });

        // Add arrow to the clicked element
        clickedElement.textContent += " ▷";

        if (clickedElement.classList.contains("emptySlot")) {
            // If the element is empty, make both cards empty
            infoBox.innerHTML = "";
            planetInfo.innerHTML = "";
        } else {
            const characterIndex =
                Array.from(clickedElement.parentNode.children).indexOf(clickedElement) +
                (currentPage - 1) * charactersPerPage;
            const characterUrl = `https://swapi.dev/api/people/${characterIndex + 1}/`;

            try {
                const response = await fetch(characterUrl);
                const characterData = await response.json();
                updateInfoBox(characterData);
            } catch (error) {
                console.error("Error during the API request:", error);
            }
        }
    }
});


  /*------------------------------Function to put new datas in the box-------------------------------- */
  async function updateInfoBox(characterData) {
    spinner2.style.display = "none";
    spinner3.style.display = "none";
    
    let characterName = characterData.name;
    let homeworldUrl = characterData.homeworld;
    infoBox.innerHTML = "";
    infoList.innerHTML = "";
    planetInfo.innerHTML = "";
    planetInfoList.innerHTML = "";
    const infoBoxh3 = document.createElement("h3");
    infoBoxh3.classList.add("infoBoxh3");
    infoBoxh3.innerHTML = characterName;

    infoBox.appendChild(infoBoxh3);

    // Objects to get and manage info that I need
    const detailsItems = [
      { label: "Height", value: characterData.height },
      { label: "Mass", value: characterData.mass },
      { label: "Hair Color", value: characterData.hair_color },
      { label: "Skin Color", value: characterData.skin_color },
      { label: "Eye Color", value: characterData.eye_color },
      { label: "Birth Year", value: characterData.birth_year },
      { label: "Gender", value: characterData.gender },
    ];

    

    // Loop and "li" for every item
    detailsItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.classList.add("detailsItem");
      listItem.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
      infoList.classList.add("infoList");
      infoList.appendChild(listItem);
    });

    if (homeworldUrl) {
      try {
        const response = await fetch(homeworldUrl);
        const homeworldData = await response.json();
        updatePlanetInfo(homeworldData);
      } catch (error) {
        console.error("Error during the API request:", error);
      }
    }

    
    infoBox.appendChild(infoList);
    
  }
  

  async function updatePlanetInfo(homeworldData) {
    planetInfoList.innerHTML = "";

    // get info for the planets
    const planetInfoItems = [
      { label: "Rotation Period", value: homeworldData.rotation_period },
      { label: "Orbital Period", value: homeworldData.orbital_period },
      { label: "Diameter", value: homeworldData.diameter },
      { label: "Climate", value: homeworldData.climate },
      { label: "Gravity", value: homeworldData.gravity },
      { label: "Terrain", value: homeworldData.terrain },
    ];

    // Creates h3 for the planets box and fills it by name 
    const planetInfoh3 = document.createElement("h3");
    planetInfoh3.classList.add("planetInfoh3");
    planetInfoh3.textContent = homeworldData.name; 
    planetInfoList.appendChild(planetInfoh3);

    // Loop and li elements creation
    planetInfoItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.classList.add("planetInfoItem");
      listItem.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
      planetInfoList.appendChild(listItem);
      planetInfo.appendChild(planetInfoList);
      playLaserSound();
    });
  }

  /*------------------------------------Buttons managing area------------------------------------- */
  showNextButton.addEventListener("click", async function () {
    if (currentPage < totalPages) {
      charactersList.innerHTML = "";
      showNextButton.style.display = "none";
      showPreviousButton.style.display = "none";
      charactersTitle.style.display = "none";
      pageCounter.style.display = "none";
      spinner.style.display = "block";
      currentPage++;
      await showCharacters();
      spinner.style.display = "none";
      pageCounter.style.display = "inline";
    }
  });

  showPreviousButton.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      showCharacters();
    }
  });
  showCharacters();
});

// Fetch data
const URL = window.location.href;
const DATA_URL = `${URL}/lib/data.json`;

const fetchData = async () => {
    try {
        const response = await fetch(DATA_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

// Variables
const data = await fetchData();

const ITEMS_IN_SELECTOR = 3;
const INTERVAL_TIME_MS = 9000;

const selectorImages = {};

let actualImageIndex = -1;
let actualMenuSelectorIndex = -1;
let interval;

// DOM elements

const selectedImageDiv = document.getElementById("selectedImageDiv");
const selectedImage = document.getElementById("selectedImage");
const selectedImageTitle = document.getElementById("selectedImageTitle");

const ulSelector = document.getElementById("ulSelector");

const btnSelectorLeft = document.getElementById("btnSelectorLeft");
const btnSelectorRight = document.getElementById("btnSelectorRight");

const btnLeftImage = document.getElementById("btnLeftImage");
const btnRightImage = document.getElementById("btnRightImage");

const btnPauseImage = document.getElementById("btnPauseImage");
const btnRandomImage = document.getElementById("btnRandomImage");

// Listeners
document.addEventListener("keydown", event => {
    const isMetaKey = event.metaKey || event.ctrlKey;
    if (isMetaKey && event.key === "ArrowRight") {
        moveRightSelector();
    } else if (isMetaKey && event.key === "ArrowLeft") {
        moveLeftSelector();
    } else if (event.key === "ArrowRight") {
        moveRightImage();
    } else if (event.key === "ArrowLeft") {
        moveLeftImage();
    }
});
btnSelectorLeft.addEventListener("click", moveLeftSelector);
btnSelectorRight.addEventListener("click", moveRightSelector);
btnLeftImage.addEventListener("click", moveLeftImage);
btnRightImage.addEventListener("click", moveRightImage);
btnRandomImage.addEventListener("click", changeToRandomImage);
btnPauseImage.addEventListener("click", () => {
    if (interval) {
        stopInterval();
    } else {
        moveRightImage();
        startInterval();
    }
});

// Print all the images

printImages(data);

// Functions for move the selector

function getNewScrollPosition() {
    return actualMenuSelectorIndex * ulSelector.offsetWidth - 1;
}

const DIRECTIONS = {
    right: "right",
    left: "left",
};
function moveSelector({ direction, indexElement = -1 }) {
    if (indexElement !== -1) {
        actualMenuSelectorIndex = Math.floor(indexElement / ITEMS_IN_SELECTOR);
    } else if (direction === DIRECTIONS.right) {
        if (actualMenuSelectorIndex + 1 < data.length / ITEMS_IN_SELECTOR) {
            actualMenuSelectorIndex++;
        } else {
            actualMenuSelectorIndex = 0;
        }
    } else if (direction === DIRECTIONS.left) {
        if (actualMenuSelectorIndex - 1 >= 0) {
            actualMenuSelectorIndex--;
        } else {
            actualMenuSelectorIndex = data.length / ITEMS_IN_SELECTOR - 1;
        }
    }

    ulSelector.scrollTo({
        left: getNewScrollPosition(),
        behavior: "smooth",
    });

    return {
        changeSelectedImage: () => {
            const newDirection = direction === DIRECTIONS.right ? 3 : 1;
            changeSelectedImage(
                (actualMenuSelectorIndex + 1) * ITEMS_IN_SELECTOR - newDirection
            );
        },
    };
}

function moveRightSelector() {
    moveSelector({ direction: DIRECTIONS.right }).changeSelectedImage();
}

function moveLeftSelector() {
    moveSelector({ direction: DIRECTIONS.left }).changeSelectedImage();
}

// Functions for move the main image

function changeSelectedImage(index) {
    const { name, image, description } = data[index];
    const { src, game } = image;

    const newTitle = `Kirby  ${name} seleccionado, de ${game}`;

    document.title = `Kirby ${name}`;

    selectedImage.src = URL + src;

    selectedImage.alt = newTitle;
    selectedImage.title = newTitle;
    selectedImageTitle.textContent = description;

    selectorImages[actualImageIndex]?.classList.remove("selectedInSelector");
    actualImageIndex = index;
    selectorImages[actualImageIndex]?.classList.add("selectedInSelector");
    startInterval();
}

function moveLeftImage() {
    const prevImageIndex = actualImageIndex - 1;
    const lastImageIndex = data.length - 1;

    changeSelectedImage(prevImageIndex >= 0 ? prevImageIndex : lastImageIndex);

    const nextImageIndex = actualImageIndex + 1;
    const isNextImageLast = nextImageIndex % ITEMS_IN_SELECTOR === 0;

    if (isNextImageLast || actualImageIndex === lastImageIndex) {
        moveSelector({ direction: DIRECTIONS.left });
    }
}

function moveRightImage() {
    const nextImageIndex = actualImageIndex + 1;
    const firstImageIndex = 0;

    changeSelectedImage(
        nextImageIndex >= data.length ? firstImageIndex : nextImageIndex
    );

    const isLastImage = actualImageIndex % ITEMS_IN_SELECTOR === 0;

    if (isLastImage) {
        moveSelector({ direction: DIRECTIONS.right });
    }
}

function stopInterval() {
    clearInterval(interval);
    interval = null;
    btnPauseImage.children[0].alt = "Play";
    btnPauseImage.children[0].src = "./images/svg/play.svg";
}

function startInterval() {
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(moveRightImage, INTERVAL_TIME_MS);
    btnPauseImage.children[0].alt = "Stop";
    btnPauseImage.children[0].src = "./images/svg/stop.svg";
}

function changeToRandomImage() {
    let indexElement = actualImageIndex;
    while (indexElement === actualImageIndex) {
        indexElement = Math.floor(Math.random() * data.length);
    }
    changeSelectedImage(indexElement);
    moveSelector({ indexElement });
}

// Functions for generate the selectors

function createSelectorImage(element, index) {
    const li = document.createElement("li");
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const p = document.createElement("p");

    const { name, image } = element;

    const text = `Kirby ${name} de ${image.game}`;

    p.textContent = name;

    img.src = URL + image.src;
    img.alt = text;
    img.title = text;

    figure.appendChild(img);

    li.appendChild(figure);
    li.appendChild(p);
    li.id = `selectorImage-${index}`;

    selectorImages[index] = li;

    ulSelector.appendChild(li);
    li.addEventListener("click", () => {
        changeSelectedImage(index);
    });
    return li;
}

function printImages(data) {
    data.forEach((element, index) => {
        createSelectorImage(element, index);
    });
    document.documentElement.style.setProperty("--elements", data.length);
    document.documentElement.style.setProperty(
        "--itemsInSelector",
        ITEMS_IN_SELECTOR
    );
    changeToRandomImage();
    selectedImageTitle.classList.add("selectedImageTitle");
}

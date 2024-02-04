// Fetch data
const URL = "https://paman00.github.io/copy-abilities-in-kirby-superstar";
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

let actualImageIndex = 0;
const itemsInSelector = 3;
let actualMenuSelectorIndex = 0;

// DOM elements

const selectedImageDiv = document.getElementById("selectedImageDiv");
const selectedImage = document.getElementById("selectedImage");
const selectedImageTitle = document.getElementById("selectedImageTitle");

const ulSelector = document.getElementById("ulSelector");

const btnSelectorLeft = document.getElementById("btnSelectorLeft");
const btnSelectorRight = document.getElementById("btnSelectorRight");

const btnLeftImage = document.getElementById("btnLeftImage");
const btnRightImage = document.getElementById("btnRightImage");

// Functions for move the selector

const moveSelector = ({ direction /* , indexToMove = undefined */ }) => {
    // TODO: indexToMove centra el selector cerca de ese index
    const widthScroll = ulSelector.scrollWidth;
    const currentScrollLeft = ulSelector.scrollLeft;

    const movementWidth =
        (ulSelector.offsetWidth / itemsInSelector) * itemsInSelector;

    let newScrollPosition = 0;

    if (direction === "right") {
        if (currentScrollLeft + movementWidth + 1 < widthScroll) {
            newScrollPosition = currentScrollLeft + movementWidth;
            actualMenuSelectorIndex++;
        } else {
            newScrollPosition = 0;
            actualMenuSelectorIndex = 0;
        }
    } else if (direction === "left") {
        if (currentScrollLeft - movementWidth + 1 >= 0) {
            newScrollPosition = currentScrollLeft - movementWidth;
            actualMenuSelectorIndex--;
        } else {
            newScrollPosition = widthScroll - ulSelector.offsetWidth;
            actualMenuSelectorIndex = Math.floor(widthScroll / movementWidth);
        }
    }
    ulSelector.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
    });

    return {
        changeImage: () =>
            changeSelectedImage(
                (actualMenuSelectorIndex + 1) * itemsInSelector - 2
            ),
    };
};

const moveLeftSelector = () =>
    moveSelector({ direction: "left" }).changeImage();
const moveRightSelector = () =>
    moveSelector({ direction: "right" }).changeImage();

btnSelectorLeft.addEventListener("click", moveLeftSelector);
btnSelectorRight.addEventListener("click", moveRightSelector);

// Functions for move the main image

const changeSelectedImage = index => {
    // TODO: añadir estilo al selector seleccionado
    const element = data[index];

    selectedImage.src = URL + element.image.src;

    const text = `Kirby  ${element.name} seleccionado, de ${element.image.game}`;
    selectedImage.alt = text;
    selectedImage.title = text;
    selectedImageTitle.textContent = element.description;

    actualImageIndex = index;
};

const moveLeftImage = () => {
    changeSelectedImage(
        actualImageIndex - 1 < 0 ? data.length - 1 : actualImageIndex - 1
    );
    if (
        (actualImageIndex + 1) % itemsInSelector === 0 ||
        actualImageIndex === data.length - 1
    ) {
        moveSelector({ direction: "left" });
    }
};

const moveRightImage = () => {
    changeSelectedImage(
        actualImageIndex + 1 >= data.length ? 0 : actualImageIndex + 1
    );
    if (actualImageIndex % itemsInSelector === 0) {
        moveSelector({ direction: "right" });
    }
};

btnLeftImage.addEventListener("click", moveLeftImage);
btnRightImage.addEventListener("click", moveRightImage);

// Functions for generate the selectors

const createSelectorImage = (element, index) => {
    const li = document.createElement("li");
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const p = document.createElement("p");

    p.textContent = element.name;

    img.src = URL + element.image.src;
    const text = `Kirby ${element.name} de ${element.image.game}`;
    img.alt = text;
    img.title = text;

    figure.appendChild(img);

    li.appendChild(figure);
    li.appendChild(p);
    li.id = `selectorImage-${index}`;
    ulSelector.appendChild(li);
    li.addEventListener("click", () => {
        changeSelectedImage(index);
    });

    return li;
};

const printImages = data => {
    // TODO: cambiar el primer index por uno random, el selector debe centrarse en el
    const firstImageIndex = Math.floor(Math.random() * data.length);
    data.forEach((element, index) => {
        if (index === 0) {
            changeSelectedImage(index);
            selectedImageTitle.classList.add("selectedImageTitle");
        }
        createSelectorImage(element, index);
    });
};

let data;
fetchData().then(response => {
    data = response;
    printImages(data);
});

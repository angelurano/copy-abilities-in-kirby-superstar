const URL = 'https://paman00.github.io/copy-abilities-in-kirby-superstar';
const DATA_URL = `${URL}/lib/data.json`;

const fetchData = async () => {
    try {
        const response = await fetch(DATA_URL);
        const data = await response.json(); 
        return data;
    } catch(error) {
        console.error(error);
    }
}

const selectedImageDiv = document.getElementById('selectedImageDiv');
const selectedImage = document.getElementById('selectedImage');
const selectedImageTitle = document.getElementById('selectedImageTitle'); 

const ulSelector = document.getElementById('ulSelector');

const btnSelectorLeft = document.getElementById('btnSelectorLeft');
const btnSelectorRight = document.getElementById('btnSelectorRight');

const moveRightSelector = () => {
    const width = ulSelector.offsetWidth;
    const goTo = ulSelector.scrollLeft + width + 1 >= ulSelector.scrollWidth ? 0 : ulSelector.scrollLeft + width;

    ulSelector.scrollTo({
        left: goTo,
        behavior: 'smooth'
    })
};
const moveLeftSelector = () => {
    const width = ulSelector.offsetWidth;
    const goTo = ulSelector.scrollLeft - width + 1 < 0 ? ulSelector.scrollWidth - width : ulSelector.scrollLeft - width;

    ulSelector.scrollTo({
        left: goTo,
        behavior: 'smooth'
    })
}
btnSelectorLeft.addEventListener('click', moveLeftSelector);
btnSelectorRight.addEventListener('click', moveRightSelector);

const changeSelectedImage = (element) => {
    if(!selectedImageTitle.classList.contains('selectedImageTitle')) 
        selectedImageTitle.classList.add('selectedImageTitle');
    const text = `Kirby ${element.name} seleccionado, de ${element.image.game}`
    selectedImage.src = URL + element.image.src;
    selectedImage.title = text;
    selectedImage.alt = text;
    selectedImageTitle.textContent = element.description;
};

const createSelectorImage = (element) => {
    const li = document.createElement('li');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const p = document.createElement('p');

    p.textContent = element.name;

    img.src = URL + element.image.src;
    const text = `Kirby ${element.name} de ${element.image.game}` 
    img.alt = text; 
    img.title = text;

    figure.appendChild(img);

    li.appendChild(figure);
    li.appendChild(p);

    li.addEventListener('click', () => {
        changeSelectedImage(element);
    });

    ulSelector.appendChild(li);
}

const printImages = async () => {
    const data = await fetchData();

    const firstImageIndex = Math.floor(Math.random() * data.length);
    data.forEach((element, index) => {
        createSelectorImage(element);
        if (index === firstImageIndex) {
            changeSelectedImage(element);
        }
    });
}

printImages();

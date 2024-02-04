const DATA_URL = '/lib/data.json';

const fetchData = async () => {
    try {
        const response = await fetch(DATA_URL);
        const data = await response.json(); 
        return data;
    } catch(error) {
        console.error(error);
    }
}

console.log(fetchData());

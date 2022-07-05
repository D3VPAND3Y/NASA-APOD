const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');



//NASA API
const count =10;
const apiKey =`vkAxj2eDd403Enl5ZZpjfK7cZHLGcU2fJPdoadJC`
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = [];
let favorites = {};


function showContent(page){
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
    if (page === 'results'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }
    else{
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}


//for each only works on an array so we need to convert the object to an array
function createDOMNodes(page){
    const currentArray = page === 'results' ?  resultsArray : Object.values(favorites);
    // console.log(currentArray,page);
    currentArray.forEach((result) => {
        //Card container
        const card = document.createElement('div');
        card.classList.add('card');
        //Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = "view Full Image";
        link.target = "_blank";
        //Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt= 'nasa image';
        image.loading = 'lazy';
        image.classList.add("card-img-top");
        // Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //Card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //Card text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        //Card footer
        const cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer');
        //Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results'){
            saveText.textContent = 'Add To Favorites';
            saveText.setAttribute("onclick",`saveFavorite('${result.url}')`);
        }
        else{
            saveText.textContent = 'Remove From Favorites';
            saveText.setAttribute("onclick",`removeFavorite('${result.url}')`);
        }

        //Footer container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        //date
        const date = document.createElement('strong');
        date.textContent = result.date;
        //copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = `    ${copyrightResult}`;
        //Append
        footer.appendChild(date);
        footer.appendChild(copyright);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(saveText);
        cardBody.appendChild(cardText);
        cardFooter.appendChild(footer);
        link.appendChild(image);
        card.appendChild(link);
        card.appendChild(cardBody);
        card.appendChild(cardFooter);
        imagesContainer.appendChild(card);

});
}



function updateDOM(page){
    //GEt Favorites from local storage
    if(localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        // console.log(favorites);
    }
    imagesContainer.textContent = ''; //Remove all elements that have been appended to the container previously 
    createDOMNodes(page);
    showContent(page);
}


//Get 10 Images from NASA API
async function getNasaPictures(){
//show loader
loader.classList.remove('hidden');

try{
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    // console.log(resultsArryay); 
    updateDOM('results');


}catch(error){
//error
    }
}
//Add Result to Favorites
function saveFavorite(url){
    resultsArray.forEach((item) => {
        if(item.url.includes(url) && !favorites[url] ){
            favorites[url] = item;
            console.log(JSON.stringify(favorites));
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }
            , 2000);
            // set favorite to local storage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

//Remove Result from Favorites
function removeFavorite(url){
   if(favorites[url]){
       delete favorites[url];
       localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
       updateDOM('favorites');
   }
}





//On Load
getNasaPictures();
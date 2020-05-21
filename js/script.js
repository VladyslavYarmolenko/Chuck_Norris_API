const overlay = document.getElementById("overlay");
const checkbox = document.getElementById("checkbox-toggle");
const rightScreen = document.getElementById("right_screen");
const rightScreenJoke  = document.getElementById("right_screen_joke");
const wrapper = document.getElementById("main");
const checkboxDiv = document.getElementById("checkbox_div");
const leftScreen = document.getElementById("left_screen");
const category = document.getElementsByClassName("category_type")[0];
const categories = document.getElementById("typeChoise_categories");
const search = document.getElementById("search_text");
const leftScreenBottom = document.getElementById("left_screen_bottom");
let form = document.getElementById('selectForm');
let URL = null; 
let link = 'random';
let CategoryName = null;
let receivedAnswer = null;

let NowTime = null;


window.addEventListener('load', function(){
  NowTime = new Date();
});



GetFavotites();
  

checkbox.addEventListener("click", checkboxHandler);
overlay.addEventListener("click", HideFavorites);

function checkboxHandler (event) {
  const checkbox = event.target;
  if (checkbox.checked === true){
    ShowFavorites();
  } 
  if (checkbox.checked === false) {
    HideFavorites();
  }
}

function ShowFavorites () {
  overlay.style.display = 'block';
  checkbox.checked = true;
  main.style.padding = "0";
  rightScreen.classList.add('right_screen_show');
  checkboxDiv.classList.add('checkbox_burger_favorites');
  leftScreen.classList.add('left_screen_hide');
}

function HideFavorites () {
  overlay.style.display = "none";
  checkbox.checked = false;
  main.style.padding = "40px";
  rightScreen.classList.remove('right_screen_show');
  checkboxDiv.classList.remove('checkbox_burger_favorites');
  leftScreen.classList.remove('left_screen_hide');
}




  const radioArr = document.getElementsByName("Radios");
  
  for(let radioCounter = 0; radioCounter < radioArr.length; radioCounter++){
    radioArr[radioCounter].addEventListener('click', function(e){
      
      if (e.target.value === "Random"){
        search.style.display = "none";
        categories.style.display = "none";
        removeButtonSelected();
        link = "random";
      }

      if (e.target.value === "categories"){
        categories.style.display = "block";
        search.style.display = "none";
        link = "random?category=";
      }

      if (e.target.value === "Search"){
        search.style.display = "block";
        categories.style.display = "none";
        removeButtonSelected();
        link = "search?query=";
      }
    }) 
  }



  

  const xhr = new XMLHttpRequest();

  xhr.open("GET", "https://api.chucknorris.io/jokes/categories")

  xhr.responseType = 'json';

  xhr.send();

  xhr.onload = function() {
    let responseObj = xhr.response;
    
    responseObj.forEach(element => {
    
     
     let CategoryDiv = document.createElement('button');
     CategoryDiv.classList.add("category");
     CategoryDiv.setAttribute('type', 'button');
     CategoryDiv.innerHTML = element;
     categories.appendChild(CategoryDiv);

    

      CategoryDiv.addEventListener('click', function(e){
      CategoryName = element;
      removeButtonSelected();
      CategorySelect = e.target;
      CategorySelect.classList.add("button_selected");
     })

    });
  }


  function removeButtonSelected() {
    let categoryArr = document.getElementsByClassName('category');
       
    for(i = 0; i < categoryArr.length; i++){
     categoryArr[i].classList.remove("button_selected");
    }
  }



  function returnLink(){
    URL = "https://api.chucknorris.io/jokes/";
  }




  form.addEventListener('submit', onSubmit); 


  

  function onSubmit(event) {

    event.preventDefault();

     let query = document.getElementsByName("textfield")[0].value;

     let requestLink;
    
    if (link === "random"){
      returnLink();
      requestLink = URL + link;

     }

    if (link === "random?category="){
      returnLink();
      requestLink = URL + link + CategoryName;
    }

    if (link === "search?query="){
      returnLink();
      requestLink = URL + link + query;
    }


    let xhr = new XMLHttpRequest();

    xhr.open('GET', requestLink);
    
    xhr.responseType = 'json';
    
    xhr.send();
    
    xhr.onload = function() {
      receivedAnswer = xhr.response;


      if (!receivedAnswer.result) {
        removeButtonSelected();
        createJokeItem(receivedAnswer, leftScreenBottom);
      }
      
      else {
        receivedAnswer.result.forEach(element => createJokeItem(element, leftScreenBottom));
      }
    };
  }


  function createJokeItem(jokeObject, screen) {

    jokeID = jokeObject.id;
    jokeValue = jokeObject.value;
    let JokeCategory = null;
    

      if(jokeObject.categories !== []){
        JokeCategory = jokeObject.categories[0];
      }
    
      

      let JokeDiv = document.createElement("div");
      JokeDiv.classList.add("joke_item");
      JokeDiv.setAttribute("data-id", jokeID);
      screen.appendChild(JokeDiv);

        /// joke item header

        let JokeDivHeader = document.createElement("div");
        JokeDivHeader.classList.add("joke_item_header");
        JokeDiv.appendChild(JokeDivHeader);


          let likeDiv = document.createElement("div");
          likeDiv.classList.add("heart_unchecked_image");
          likeDiv.setAttribute('id', "heart")
          likeDiv.addEventListener('click', function() {
            const heartImage = this;
            if (localStorage.getItem('favorites') === null){
              let favoritesArr = [];
              favoritesArr.push(jokeObject);
              localStorage.setItem('favorites',  JSON.stringify(favoritesArr));
              createJokeItem(jokeObject, rightScreenJoke);
              heartImage.classList.remove("heart_unchecked_image");
              heartImage.classList.add('heart_image');
            }
      
      
            else {
                let favoritesArr = localStorage.getItem('favorites');
                favoritesArr = JSON.parse(favoritesArr);
                if(favoritesArr.find(function(item){return item.id === jokeObject.id})){
                  favoritesArr =  favoritesArr.filter(item => item.id !== jokeObject.id);
                  localStorage.setItem('favorites', JSON.stringify(favoritesArr));
                  heartImage.classList.remove("heart_unchecked_image");
                  heartImage.classList.add('heart_unchecked_image');
                  removeJokeItem(jokeObject.id);
                  let updateTime = rightScreenJoke.getElementsByClassName('update_info');
                  console.log(updateTime);
               }
      
                else {
                favoritesArr.push(jokeObject);
                localStorage.setItem('favorites', JSON.stringify(favoritesArr));
                createJokeItem(jokeObject, rightScreenJoke);
                heartImage.classList.remove("heart_unchecked_image");
                heartImage.classList.add('heart_image');
            }
          }
          });
          JokeDivHeader.appendChild(likeDiv);

        /// joke item center

        let JokeCenter = document.createElement('div');
        JokeCenter.classList.add("joke_item_center")
        JokeDiv.appendChild(JokeCenter);

          let centerImg = document.createElement("div");
          centerImg.classList.add("joke_item_center_image");
          JokeCenter.appendChild(centerImg);

            let IMG = document.createElement("img");
            IMG.classList.add("joke_item_image_comment");
            IMG.setAttribute('src', 'css/comment.png');
            centerImg.appendChild(IMG);


          /// joke item center content

          let centerContent = document.createElement("div");
          centerContent.classList.add("joke_item_center_content");
          JokeCenter.appendChild(centerContent);

            /// joke item id

            let idWrapper = document.createElement("div");
            idWrapper.classList.add("joke_item_ID");
            centerContent.appendChild(idWrapper);

              let titleID = document.createElement("p");
              titleID.classList.add("title_ID");
              titleID.innerHTML = "ID:"
              idWrapper.appendChild(titleID);

              let idNum = document.createElement("p");
              idNum.classList.add("ID_num");
              idNum.innerHTML = jokeID;
              idWrapper.appendChild(idNum);

              let exitImg = document.createElement("img");
              exitImg.classList.add("exit_img");
              exitImg.setAttribute('src', 'css/exit.png');
              idWrapper.appendChild(exitImg);

            ///  joke item text

            let jokeText =  document.createElement("div");
            jokeText.classList.add("joke_item_text");
            jokeText.innerHTML = jokeValue;
            centerContent.appendChild(jokeText);

        /// joke item bottom

        let jokeBottom = document.createElement("div");
        jokeBottom.classList.add("joke_item_bottom");
        JokeDiv.appendChild(jokeBottom);

          //last update
          let lastUpdate = document.createElement('div');
          lastUpdate.classList.add('last_update');
          jokeBottom.appendChild(lastUpdate);


            let updateTitle = document.createElement('p');
            updateTitle.classList.add('update_title');
            updateTitle.innerHTML = "Last update:";
            lastUpdate.appendChild(updateTitle);


            let updateInfo = document.createElement('p');
            updateInfo.classList.add('update_info');
            let updateTime = new Date();
            let updateDiff = GetTimeDiff(updateTime, NowTime);
            updateInfo.innerHTML = updateDiff + " hours ago";
            lastUpdate.appendChild(updateInfo);

          
          //category type
          if (JokeCategory){
            let CategoryType = document.createElement('div');
            CategoryType.classList.add('category_type');
            CategoryType.innerHTML = JokeCategory;
            jokeBottom.appendChild(CategoryType);
          } 
    }


    function removeJokeItem(id){
      let FavJokeItem = rightScreenJoke.querySelector(`[data-id=${id}]`);
      let Joke = leftScreenBottom.querySelector(`[data-id=${id}]`);

      FavJokeItem.remove();
      let JokeLike = Joke.querySelector(`[id=${"heart"}]`);
      if(JokeLike){
      JokeLike.classList.remove("heart_image");
      JokeLike.classList.add('heart_unchecked_image');
    }
    }


    function GetFavotites() {
     if  (localStorage.getItem('favorites') === null){
      return;
     }

     else {
      let saveFavorites =localStorage.getItem('favorites');
      saveFavorites = JSON.parse(saveFavorites);
      saveFavorites.forEach(element => createJokeItem(element, rightScreenJoke))
     }
    }



    function GetTimeDiff (publicationDate, OnloadDate){
      let diff = OnloadDate - publicationDate
      return Math.round(diff/3600000);
    }

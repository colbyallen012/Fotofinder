var fotoCards = JSON.parse(localStorage.getItem("fotoCards")) || [];
let currentCardList;
let cardsHidden = false;
var searchInput = document.querySelector('.search-input');
var addBtn = document.querySelector('.add-to-album');
var cardArea = document.querySelector('.card-area');
var reader = new FileReader();
var chooseFile = document.querySelector('.choose-file');
var newTitle = document.getElementById('new-title');
var newCaption = document.getElementById('new-caption');
var searchInput = document.querySelector('.search-input');
var showBtn = document.querySelector('.show-btn')

addBtn.addEventListener('click', loadImg);
cardArea.addEventListener('click', clickCardEvents);
searchInput.addEventListener('keyup', onSearchKeyup);
showBtn.addEventListener('click', onShow);
cardArea.addEventListener('keypress', function(e) {
  var key = e.which || e.keyCode;
  if (key === 13) {
    e.preventDefault();
    var fieldId = e.target.id;
    var cardId = parseInt(e.target.closest('.card').dataset.identifier);
    var updatedTxt = e.target.textContent;
    findObjectById(cardId).updatePhoto(fieldId, updatedTxt);
  }
});

restoreAllCards(fotoCards);

function clickCardEvents(e) {
  if (e.target.classList.contains('delete-btn')) {
    onDelete(e);
  }
  if (e.target.classList.contains('favorite-svg')) {
    favoritePhoto(e);
  }
}

function restoreAllCards(array) {
  fotoCards = [];
  array.forEach(function(foto) {
    var restoreCard = new fotoCard(foto.title, foto.caption, foto.cardId, foto.file, foto.favorite);
    fotoCards.push(restoreCard);
    displayCard(restoreCard);
  });
  updateCurrentCardList();
}

function makeImg (e) {
  var newCard = new fotoCard(newTitle.value, newCaption.value, Date.now(), e.target.result, false);

  fotoCards.push(newCard);
  newCard.saveToStorage(fotoCards);
  displayCard(newCard);
  updateCurrentCardList();
}

function loadImg (e) {
  e.preventDefault();
  if (chooseFile.files[0]){
    reader.readAsDataURL(chooseFile.files[0]);
    reader.onload = makeImg;
  updateCurrentCardList();
  }
}

function onFocusOut(cardId) {
  var updatedTxt = event.target.textContent;
  var fieldId = event.target.id;
  findObjectById(cardId).updatePhoto(fieldId, updatedTxt);
}


function onDelete(e) {
    var cardElement = e.target.closest('.card');
    var match = findObjectById(parseInt(cardElement.dataset.identifier));
    
    match.deleteFromStorage();
    cardElement.remove();
  }


function onSearchKeyup() {
  var matchingFotoCards = fotoCards.filter(function(foto) {
    return foto.caption.toLowerCase().includes(searchInput.value.toLowerCase()) || 
    foto.title.toLowerCase().includes(searchInput.value.toLowerCase());
  });
  cardArea.innerHTML = "";
  matchingFotoCards.forEach(foto => displayCard(foto));
  updateCurrentCardList();
}

function onShow() {
  if (cardsHidden === false) {
    hideCards();
  } else {
    showCards();
  }
}

function displayCard(fotoCard) {
  var html = `<article class="card" data-identifier=${fotoCard.cardId}>
    <div class"card-main">
      <h2 class="card-title" id="card-name"contenteditable="true" onfocusout="onFocusOut(${fotoCard.cardId})">${fotoCard.title}</h2>
      <img class="card-image" src="${fotoCard.file}" />
    <div class"card-caption">
      <p class="card-txt" contenteditable="true" id="fotoCaption"  onfocusout="onFocusOut(${fotoCard.cardId})">${fotoCard.caption}</p>
    </div>
    </div>
      <footer class="card-footer">
        <img class="delete-btn" onClick="onDelete(${fotoCard.cardId})" src="images/delete.svg" />
        <button class="fav-btn favorite-svg"></button>
      </footer>
    </article>`;
  cardArea.insertAdjacentHTML("afterbegin", html);
}

function favoritePhoto(e) {
  var cardElement = e.target.closest('.card');
  var favoritedPhoto = findObjectById(parseInt(cardElement.dataset.identifier));
 if(favoritedPhoto.favorite === false) {
   favoritedPhoto.favorite = true;
   e.target.classList.add("favorite-active-svg");
 } else {
   favoritedPhoto.favorite = false;
   e.target.classList.remove("favorite-active-svg");
 }
    favoritedPhoto.saveToStorage();
}

function hideCards() {
  for (var i = 0; i < (currentCardList.length - 10); i++) {
    currentCardList[i].classList.add('hide-card');
  }
  showBtn.innerText = "Show More...";
  cardsHidden = true;
}

function showCards() {
  currentCardList.forEach(card => card.classList.remove('hide-card'));
  showBtn.innerText = "Show Less...";
  cardsHidden = false;
}

function overTenCards() {
  return currentCardList.length > 10;
}

function updateCurrentCardList() {
  currentCardList = document.querySelectorAll('.card');
  hideCards();

  if (overTenCards() === false) {
    showBtn.classList.add('hidden');
  } else {
    showBtn.classList.remove('hidden');
  }
}

function findObjectById(id) {
  return fotoCards.find(foto => foto.cardId === id);
}

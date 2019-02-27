class fotoCard {
  constructor (title, caption, cardId, file, favorite) {
    this.title = title;
    this.caption = caption;
    this.cardId = cardId;
    this.file = file;
    this.favorite = favorite;
  }
  saveToStorage() {
    var stringifiedImg = JSON.stringify(fotoCards);
    localStorage.setItem("fotoCards", stringifiedImg);
  }
  updatePhoto(fieldId, updatedTxt) {
    if (fieldId === 'card-name') {
      this.title = updatedTxt;
    } else {
      this.caption = updatedTxt;
    }

    this.saveToStorage(fotoCards);
  }
  deleteFromStorage() {
    var index = fotoCards.indexOf(this);

    fotoCards.splice(index, 1);
    this.saveToStorage();
  }
}
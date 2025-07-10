import Api from "../utils/Api.js";
import { setButtonText, deletingText } from "../utils/helpers.js";
import { disableButton } from "../scripts/validation.js";
import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import logoSrc from "../images/Logo.svg";
const logoImage = document.getElementById("logo");
logoImage.src = logoSrc;

import avatarSrc from "../images/avatar.jpg";
const avatarImg = document.getElementById("avatarImg");
avatarImg.src = avatarSrc;

import pencilSrc from "../images/Pencil_icon.svg";
const pencilIcon = document.getElementById("pencilIcon");
pencilIcon.src = pencilSrc;

import plusSrc from "../images/plus_icon.svg";
const plusIcon = document.getElementById("plusIcon");
plusIcon.src = plusSrc;

//const initalCards = [
//  {
//    name: "Val Thorens",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//    alt: "Val Thorens Img",
//  },
//
//  {
//    name: "Restaurant terrace",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//    alt: "Restaurant Img",
//  },
//  {
//    name: "An outdoor cafe",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//    alt: "Cafe Img",
//  },
//  {
//    name: "A very long bridge, over the forest and through the trees",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//    alt: "Long Bridge Img",
//  },
//  {
//    name: "Tunnel with morning light",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//    alt: "Tunnel Img",
//  },
//  {
//    name: "Mountain house",
//    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//    alt: "Mountain House Img",
//  },
//];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c088b459-8530-4fda-a3f7-5b4a32018893",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, users]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileImage.src = users.avatar;
    profileName.textContent = users.name;
    profileDescription.textContent = users.about;
  })
  .catch(console.error);

//Avatar Forms
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalClosebtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//Profile Forms
const profileEditButton = document.querySelector(".profile__edit-button");
const profileImage = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

//Edit Forms
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalcloseButton = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

//Delete Forms
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCancelButton = deleteModal.querySelector(
  ".modal__submit-btn_type_cancel"
);

//Card Forms
const cardModalBtn = document.querySelector(".profile__add-button");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitButton = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//Preview Forms
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEL = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalContainerCloseBtn = previewModal.querySelector(
  ".modal__container_type_preview"
);

let selectedCard;
let selectedCardId;

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handlePressEsc);
  modal.addEventListener("click", clickOutModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  deletingText(submitBtn, true);
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      deletingText(submitBtn, false);
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt, id) {
  const cardLikeButton = evt.target;
  const isLiked = cardLikeButton.classList.contains("card__like-button");

  api
    .handleLike(id, isLiked)
    .then(() => {
      cardLikeButton.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardLinkEl = cardElement.querySelector(".card__img");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardTrashButton = cardElement.querySelector(".card__trash-btn");

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardNameEl.textContent = data.name;
  cardLinkEl.src = data.link;
  cardLinkEl.alt = data.alt;

  cardLinkEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEL.src = data.link;
    previewModalImageEL.alt = data.alt;
    previewModalCaptionEl.textContent = data.name;
  });

  cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardTrashButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );
  return cardElement;
}

function handlePressEsc(event) {
  if (event.key === "Escape") {
    const currentModal = document.querySelector(".modal_opened");
    closeModal(currentModal);
  }
}

function clickOutModal(event) {
  if (
    event.target === event.currentTarget ||
    event.target.classList.contains("modal__close-btn")
  ) {
    closeModal(event.currentTarget);
  }
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handlePressEsc);
  modal.removeEventListener("click", clickOutModal);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  //submitBtn.textContent = "Saving...";
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((cardData) => {
      //cardsList.prepend(cardElement);
      renderCard(cardData);
      evt.target.reset();
      disableButton(cardSubmitButton, settings);
      closeModal(cardModal);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
  //const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  //const cardElement = getCardElement(inputValues);
  //cardsList.prepend(cardElement);
  //disableButton(cardSubmitButton, settings);
  //closeModal(cardModal);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  return api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      profileImage.src = data.avatar;
      disableButton(avatarSubmitBtn, settings);
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

//function closeOnEsc(event) {
//  if (event.key === "Escape") {
//    openModal(cardModal);
//  }
//}

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);
deleteCancelButton.addEventListener("click", () => closeModal(deleteModal));

enableValidation(settings);

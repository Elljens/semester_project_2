import { get, put } from "../service/apiClient.js";
import {
  bioInput,
  avatarUrlInput,
  avatarAltInput,
  bannerUrlInput,
  bannerAltInput,
} from "../service/validators.js";
import {
  validateBio,
  validateAvatar,
  validateBanner,
} from "../service/validators.js";

const form = document.querySelector("#edit-profile-form");
const formError = document.querySelector("#formError");
const formSuccess = document.querySelector("#formSuccess");

const params = new URLSearchParams(window.location.search);
const name = params.get("name");

if (!name) {
  alert("Profile not found");
}

async function getProfileToEdit() {
  try {
    const result = await get(`/auction/profiles/${name}`);

    const profileToEdit = result.data;

    bioInput.value = profileToEdit.bio;
    avatarUrlInput.value = profileToEdit.avatar.url;
    avatarAltInput.value = profileToEdit.avatar.alt;
    bannerUrlInput.value = profileToEdit.banner.url;
    bannerAltInput.value = profileToEdit.banner.alt;
  } catch (error) {}
}

getProfileToEdit();

async function updateUser(userDetails) {
  try {
    const response = await put(`/auction/profiles/${name}`, userDetails);

    formError.classList.add("hidden");

    formSuccess.classList.remove("hidden");
    formSuccess.textContent = "Update successful. Redirecting to profile...";

    setTimeout(() => {
      window.location.href = `./myProfile.html?name=${name}`;
    }, 2000);
  } catch (error) {
    formSuccess.classList.add("hidden");
    formError.classList.remove("hidden");
    formError.textContent = error;
    console.log(error);
  }
}

function submitForm(event) {
  event.preventDefault();

  const isBioValid = validateBio();
  const isAvatarValid = validateAvatar();
  const isBannerValid = validateBanner();

  const isFormValid = isBioValid && isAvatarValid && isBannerValid;

  if (!isFormValid) {
    return;
  }

  const userdata = {};
  if (bioInput.value.trim()) {
    userdata.bio = bioInput.value.trim();
  }
  if (avatarUrlInput.value.trim()) {
    userdata.avatar = {
      url: avatarUrlInput.value.trim(),
      alt: avatarAltInput.value.trim(),
    };
  }
  if (bannerUrlInput.value.trim()) {
    userdata.banner = {
      url: bannerUrlInput.value.trim(),
      alt: bannerAltInput.value.trim(),
    };
  }

  updateUser(userdata);
}

form.addEventListener("submit", submitForm);

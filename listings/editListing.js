import { put, get } from "../service/apiClient.js";
import { name } from "../service/utils.js";

const editForm = document.querySelector("#edit-form");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const tags = document.querySelector("#tags");
const mediaURL = document.querySelector("#media-url");
const mediaALT = document.querySelector("#media-alt");
const endsAt = document.querySelector("#ends-at");

const formError = document.querySelector("#formError");
const formSuccess = document.querySelector("#formSuccess");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("No post ID found");
}

async function getListingToEdit() {
  try {
    const result = await get(`/auction/listings/${id}`);
    const edits = result.data;

    title.value = edits.title;
    description.value = edits.description;
    tags.value = edits.tags;
    mediaURL.value = edits.media?.[0]?.url || "";
    mediaALT.value = edits.media?.[0]?.alt || "";
    endsAt.value = edits.endsAt.slice(0, 16);
  } catch (error) {
    console.log(error);
  }
}

getListingToEdit();

async function editListing(listingDetails) {
  try {
    const response = await put(`/auction/listings/${id}`, listingDetails);

    formError.classList.add("hidden");

    formSuccess.textContent = "Listing edited successfully!";
    formSuccess.classList.remove("hidden");

    setTimeout(() => {
      window.location.href = `../profile/myProfile.html?name=${name}`;
    }, 2000);

    editForm.reset();
  } catch (error) {
    formSuccess.classList.add("hidden");

    formError.textContent = error.message || error;
    formError.classList.remove("hidden");

    console.error(error);
  }
}

function submitForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);

  const listingDetails = {
    title: formFields.title,
    endsAt: new Date(formFields.endsAt).toISOString(),
  };

  if (formFields.description.trim()) {
    listingDetails.description = formFields.description.trim();
  }

  if (formFields.tags.trim()) {
    listingDetails.tags = formFields.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (formFields.mediaUrl.trim()) {
    listingDetails.media = [
      {
        url: formFields.mediaUrl.trim(),
        alt: formFields.mediaAlt.trim(),
      },
    ];
  }

  editListing(listingDetails);
}

editForm.addEventListener("submit", submitForm);

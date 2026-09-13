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
    description.value = edits.description || "";
    tags.value = edits.tags || "";
    endsAt.value = edits.endsAt.slice(0, 16);

    const media = edits.media || [];
    if (media.length > 0) {
      mediaURL.value = media?.[0]?.url || "";
      mediaALT.value = media?.[0]?.alt || "";
    }

    media.slice(1).forEach((image, index) => {
      createMediaRow(image, index + 2);
    });
  } catch (error) {
    console.log(error);
  }
}

getListingToEdit();

const mediaFields = document.getElementById("media-fields");
const addImageButton = document.getElementById("add-image");

let imageIndex = 2;

function createMediaRow(image = {}, index) {
  addImageButton.addEventListener("click", () => {
    const mediaRow = document.createElement("div");

    mediaRow.classList.add("mx-auto", "flex", "max-w-md", "flex-col");

    const urlContainer = document.createElement("div");
    urlContainer.classList.add("flex", "flex-col");

    const urlLabel = document.createElement("label");
    urlLabel.textContent = "Image URL";

    const urlInput = document.createElement("input");
    urlInput.type = "url";
    urlInput.name = "mediaUrl";
    urlInput.id = `media-url-${index}`;
    urlInput.value = image.url || "";
    urlInput.classList.add(
      "mb-3",
      "h-10",
      "rounded-sm",
      "border",
      "border-gray-300",
      "bg-white",
      "p-2",
      "shadow-inner",
    );
    urlLabel.htmlFor = urlInput.id;

    urlContainer.append(urlLabel, urlInput);

    const altContainer = document.createElement("div");
    altContainer.classList.add("flex", "flex-col");

    const altLabel = document.createElement("label");
    altLabel.textContent = "Image Description";

    const altInput = document.createElement("input");
    altInput.type = "text";
    altInput.name = "mediaAlt";
    altInput.value = image.alt || "";
    altInput.classList.add(
      "mb-3",
      "h-10",
      "rounded-sm",
      "border",
      "border-gray-300",
      "bg-white",
      "p-2",
      "shadow-inner",
    );

    altLabel.htmlFor = altInput.id;

    altContainer.append(altLabel, altInput);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      mediaRow.remove();
    });

    mediaRow.append(urlContainer, altContainer, removeButton);

    mediaFields.appendChild(mediaRow);
  });
}

addImageButton.addEventListener("click", () => {
  createMediaRow({}, imageIndex);
  imageIndex++;
});

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

  const mediaUrls = formData.getAll("mediaUrl");
  const mediaAlts = formData.getAll("mediaAlt");

  const media = mediaUrls
    .map((url, index) => ({
      url: url.trim(),
      alt: mediaAlts[index]?.trim || "",
    }))
    .filter((image) => image.url);

  listingDetails.media = media;

  editListing(listingDetails);
}

editForm.addEventListener("submit", submitForm);

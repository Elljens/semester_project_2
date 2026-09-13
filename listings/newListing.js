import { post } from "../service/apiClient.js";
import { name } from "../service/utils.js";

const form = document.querySelector("#create-form");
const formError = document.querySelector("#formError");
const formSuccess = document.querySelector("#formSuccess");

const mediaFields = document.getElementById("media-fields");
const addImageButton = document.getElementById("add-image");

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

  urlContainer.append(urlLabel, urlInput);

  const altContainer = document.createElement("div");
  altContainer.classList.add("flex", "flex-col");

  const altLabel = document.createElement("label");
  altLabel.textContent = "Image Description";

  const altInput = document.createElement("input");
  altInput.type = "text";
  altInput.name = "mediaAlt";
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

async function createListing(listingDetails) {
  try {
    const response = await post("/auction/listings", listingDetails);

    formError.classList.add("hidden");

    formSuccess.textContent = "Listing created successfully!";
    formSuccess.classList.remove("hidden");

    setTimeout(() => {
      window.location.href = `../profile/myProfile.html?name=${name}`;
    }, 2000);

    console.log(response);

    form.reset();
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
      alt: mediaAlts[index]?.trim() || "",
    }))
    .filter((image) => image.url);

  if (media.length > 0) {
    listingDetails.media = media;
  }

  createListing(listingDetails);
}

form.addEventListener("submit", submitForm);

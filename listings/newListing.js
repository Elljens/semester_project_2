import { post } from "../service/apiClient.js";

const form = document.querySelector("#create-form");
const formError = document.querySelector("#formError");
const formSuccess = document.querySelector("#formSuccess");

async function createListing(listingDetails) {
  try {
    const response = await post("/auction/listings", listingDetails);

    formError.classList.add("hidden");

    formSuccess.textContent = "Listing created successfully!";
    formSuccess.classList.remove("hidden");

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

  if (formFields.mediaUrl.trim()) {
    listingDetails.media = [
      {
        url: formFields.mediaUrl.trim(),
        alt: formFields.mediaAlt.trim(),
      },
    ];
  }

  createListing(listingDetails);
}

form.addEventListener("submit", submitForm);

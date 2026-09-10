import { addToLocalStorage, getFromLocalStorage } from "../service/utils.js";
import { post } from "../service/apiClient.js";

const loginForm = document.querySelector("#login-form");
const formError = document.querySelector("#formError");
const formSuccess = document.querySelector("#formSuccess");

async function logInUSer(userDetails) {
  try {
    const response = await post("/auth/login", userDetails);

    const accessToken = response.data.accessToken;
    const name = response.data.name;

    addToLocalStorage("name", name);
    addToLocalStorage("accessToken", accessToken);

    await createAPIKey();

    formSuccess.classList.remove("hidden");
    formSuccess.textContent = "Login successful. Redirecting to main page..";

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);

    console.log("Login successful");
  } catch (error) {
    formSuccess.classList.add("hidden");
    formError.classList.remove("hidden");
    formError.textContent = error;
    console.log(error);
  }
}

async function createAPIKey() {
  try {
    const existingAPIKey = getFromLocalStorage("APIKey");

    if (existingAPIKey) {
      return;
    }

    const response = await post("/auth/create-api-key", {
      name: "Auction API Key",
    });
    const APIKey = response.data.key;

    addToLocalStorage("APIKey", APIKey);
  } catch (error) {
    console.log(error);
  }
}

function submitForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);
  logInUSer(formFields);
}

loginForm.addEventListener("submit", submitForm);

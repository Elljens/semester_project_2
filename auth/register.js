import { post } from "../service/apiClient.js";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../service/validators.js";
import { nameInput, emailInput, passwordInput } from "../service/validators.js";

const form = document.querySelector("#register-form");
const formError = document.querySelector("#formError");
const formSuccess = document.querySelector("#formSuccess");

async function registerNewUser(userDetails) {
  try {
    const response = await post("/auth/register", userDetails);

    formError.classList.add("hidden");

    formSuccess.classList.remove("hidden");
    formSuccess.textContent =
      "Registration successful. Redirecting to login...";

    setTimeout(() => {
      window.location.href = "./login.html";
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

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  const isFormValid = isNameValid && isEmailValid && isPasswordValid;

  if (!isFormValid) {
    return;
  }

  const userdata = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
  };

  registerNewUser(userdata);
  console.log(userdata);
}

form.addEventListener("submit", submitForm);

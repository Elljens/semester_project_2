export const nameInput = document.querySelector("#name");
export const emailInput = document.querySelector("#email");
export const passwordInput = document.querySelector("#password");
export const bioInput = document.querySelector("#bio");

export const avatarUrlInput = document.querySelector("#avatar-url");
export const avatarAltInput = document.querySelector("#avatar-alt");

export const bannerUrlInput = document.querySelector("#banner-url");
export const bannerAltInput = document.querySelector("#banner-alt");

//Displayng errors//
function showError(input, message) {
  const errorElement = document.querySelector(`#${input.id}Error`);

  input.classList.add("border-red-500");

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  }
}

function clearError(input) {
  const errorElement = document.querySelector(`#${input.id}Error`);

  input.classList.remove("border-red-500");

  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.add("hidden");
  }
}

export function validateName() {
  const name = nameInput.value.trim();

  clearError(nameInput);

  if (!name) {
    showError(nameInput, "Username is required");
    return false;
  }

  const nameRegex = /^[a-zA-Z0-9_]+$/;

  if (!nameRegex.test(name)) {
    showError(
      nameInput,
      "Username can only contain letters, numbers and underscores",
    );

    return false;
  }

  return true;
}

export function validateEmail() {
  const email = emailInput.value.trim();

  clearError(emailInput);

  const emailRegex = /^[^\s@]+@stud\.noroff\.no$/;

  if (!emailRegex.test(email)) {
    showError(
      emailInput,
      "Please enter a valid @stud.noroff.no email address.",
    );

    return false;
  }

  return true;
}

export function validatePassword() {
  const password = passwordInput.value;

  clearError(passwordInput);

  if (password.length < 8) {
    showError(passwordInput, "Password must be at least 8 characters.");

    return false;
  }

  return true;
}

export function validateBio() {
  const bio = bioInput.value.trim();

  clearError(bioInput);

  if (bio.length >= 160) {
    showError(bioInput, "Bio must be less than 160 characters.");

    return false;
  }

  return true;
}

export function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function validateAvatar() {
  const avatarUrl = avatarUrlInput.value.trim();
  const avatarAlt = avatarAltInput.value.trim();

  clearError(avatarUrlInput);
  clearError(avatarAltInput);

  if (avatarAlt && !avatarUrl) {
    showError(
      avatarAltInput,
      "Please provide an avatar URL when using avatar alt text.",
    );

    return false;
  }

  if (avatarUrl && !isValidUrl(avatarUrl)) {
    showError(avatarUrlInput, "Please enter a valid avatar URL.");

    return false;
  }

  if (avatarAlt.length >= 120) {
    showError(
      avatarAltInput,
      "Avatar description must be less than 120 characters.",
    );

    return false;
  }

  return true;
}

export function validateBanner() {
  const bannerUrl = bannerUrlInput.value.trim();
  const bannerAlt = bannerAltInput.value.trim();

  clearError(bannerUrlInput);
  clearError(bannerAltInput);

  if (bannerAlt && !bannerUrl) {
    showError(
      bannerAltInput,
      "Please provide a banner URL when using banner alt text.",
    );

    return false;
  }

  if (bannerUrl && !isValidUrl(bannerUrl)) {
    showError(bannerUrlInput, "Please enter a valid banner URL.");

    return false;
  }

  if (bannerAlt.length >= 120) {
    showError(
      bannerAltInput,
      "Banner description must be less than 120 characters.",
    );

    return false;
  }

  return true;
}

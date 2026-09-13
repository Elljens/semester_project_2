import { get } from "./apiClient.js";
import { accessToken, name } from "./utils.js";

const loggedOutNav = document.getElementById("logged-out-nav");
const loggedInNav = document.getElementById("logged-in-nav");

const username = document.getElementById("header-name");
const credit = document.getElementById("header-credit");
const avatar = document.getElementById("header-avatar");

const avatarButton = document.getElementById("avatar-button");
const userMenu = document.getElementById("user-menu");
const logOutButton = document.getElementById("logout-button");

async function updateHeader() {
  if (!accessToken || !name) {
    showLoggedOutHeader();
    return;
  }

  showLoggedInHeader();

  try {
    const response = await get(`/auction/profiles/${name}`);
    const profile = response.data;

    username.textContent = profile.name;
    credit.textContent = `${profile.credits}`;
    avatar.src = profile.avatar.url;
    avatar.alt = profile.avatar.alt;
  } catch (error) {
    console.log(error);
  }
}

function showLoggedOutHeader() {
  loggedOutNav.classList.remove("hidden");
  loggedOutNav.classList.add("flex");

  loggedInNav.classList.add("hidden");
  loggedInNav.classList.remove("flex");
}

function showLoggedInHeader() {
  loggedOutNav.classList.add("hidden");
  loggedOutNav.classList.remove("flex");

  loggedInNav.classList.remove("hidden");
  loggedInNav.classList.add("flex");
}

avatarButton?.addEventListener("click", () => {
  const isOpen = !userMenu.classList.contains("hidden");

  userMenu.classList.toggle("hidden");

  avatarButton.setAttribute("aria-expanded", String(!isOpen));
});

logOutButton?.addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("name");
  localStorage.removeItem("APIKey");

  alert("You are logged out");

  const isHomePage =
    window.location.pathname.endsWith("./index.html") ||
    window.location.pathname.endsWith("/");

  window.location.href = isHomePage ? "./index.html" : "../index.html";
});

updateHeader();

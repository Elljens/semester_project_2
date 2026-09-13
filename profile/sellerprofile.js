import { get } from "../service/apiClient.js";

const profileContainer = document.getElementById("profile-container");
const myListingContainer = document.getElementById("listings-container");
const myBidsContainer = document.getElementById("bids-container");

const params = new URLSearchParams(window.location.search);
const name = params.get("name");

if (!name) {
  alert("No profile found");
}

async function getProfile() {
  try {
    const result = await get(
      `/auction/profiles/${name}?_listings=true&_wins=true`,
    );

    const profile = result.data;

    const banner = document.createElement("img");
    banner.src = profile.banner.url;
    banner.alt = profile.banner.alt;
    banner.classList.add("w-full", "h-100", "object-cover", "rounded-t-lg");

    const user = document.createElement("div");
    user.classList.add("flex", "flex-col", "sm:flex-row");

    const avatar = document.createElement("img");
    avatar.src = profile.avatar.url;
    avatar.alt = profile.avatar.alt;
    avatar.classList.add("h-20", "w-20", "object-cover", "rounded-full");

    const userInfo = document.createElement("div");
    userInfo.classList.add("px-3");

    const userName = document.createElement("h1");
    userName.textContent = profile.name;
    userName.classList.add("font-heading", "font-medium", "text-xl", "py-3");

    const userEmail = document.createElement("p");
    userEmail.textContent = profile.email;

    const bio = document.createElement("p");
    bio.textContent = profile.bio || "No bio added";
    bio.classList.add("py-3", "max-w-lg");

    const profileBox = document.createElement("div");

    const credit = document.createElement("h2");
    credit.textContent = "Credit: " + profile.credits;
    credit.classList.add("font-heading", "font-medium", "text-xl", "p-3");

    const userBox = document.createElement("div");
    userBox.classList.add(
      "flex",
      "flex-col",
      "sm:flex-row",
      "justify-between",
      "p-5",
    );

    userInfo.appendChild(userName);
    userInfo.appendChild(userEmail);
    userInfo.appendChild(bio);
    user.appendChild(avatar);
    user.appendChild(userInfo);
    profileBox.appendChild(credit);
    userBox.appendChild(user);
    userBox.appendChild(profileBox);
    profileContainer.appendChild(banner);
    profileContainer.appendChild(userBox);

    const bidsResult = await get(
      `/auction/profiles/${name}/bids?_listings=true`,
    );

    const bids = bidsResult.data;

    if (profile.listings.length === 0) {
      const noListing = document.createElement("p");
      noListing.textContent = "The user has not created any listings yet";

      myListingContainer.appendChild(noListing);
    }

    profile.listings.forEach((listing) => {
      const card = document.createElement("div");
      card.classList.add(
        "flex",
        "flex-col",
        "justify-center",
        "bg-white",
        "rounded-lg",
        "shadow-md",
        "max-w-320",
        "overflow-hidden",
        "px-5",
        "py-3",
      );

      const image = document.createElement("img");
      image.src = listing.media?.[0]?.url || "../public/no_image.png";
      image.alt = listing.media?.[0]?.alt || listing.title;
      image.classList.add("h-65", "object-cover");

      image.onerror = () => {
        image.src = "../public/no_image.png";
      };

      const title = document.createElement("h3");
      title.textContent = listing.title;
      title.classList.add(
        "font-heading",
        "font-medium",
        "text-xl",
        "text-center",
        "my-3",
        "min-h-16",
      );

      const id = listing.id;

      const link = document.createElement("a");
      link.href = `../listings/details.html?id=${listing.id}`;
      link.classList.add(
        "bg-brand",
        "text-white",
        "text-center",
        "p-1",
        "mx-5",
        "my-5",
        "rounded-md",
        "shadow-md",
      );
      link.textContent = "View listing";

      card.appendChild(title);
      card.appendChild(image);
      card.appendChild(link);

      myListingContainer.appendChild(card);
    });

    if (bids.length === 0) {
      const noBids = document.createElement("p");
      noBids.textContent = "The user has not made any bids yet";

      myBidsContainer.appendChild(noBids);
    }

    bids.forEach((bid) => {
      const listing = bid.listing;

      if (!listing) return;

      const card = document.createElement("div");
      card.classList.add(
        "flex",
        "flex-col",
        "justify-center",
        "bg-white",
        "rounded-lg",
        "shadow-md",
        "max-w-320",
        "overflow-hidden",
        "px-5",
        "py-3",
      );

      const image = document.createElement("img");
      image.src = listing.media?.[0]?.url || "../public/no_image.png";
      image.alt = listing.media?.[0]?.alt || listing.title;
      image.classList.add("h-65", "object-cover");

      image.onerror = () => {
        image.src = "../public/no_image.png";
      };

      const title = document.createElement("h3");
      title.textContent = listing.title;
      title.classList.add(
        "font-heading",
        "font-medium",
        "text-xl",
        "text-center",
        "my-3",
        "min-h-16",
      );

      const link = document.createElement("a");
      link.href = `../listings/details.html?id=${listing.id}`;
      link.classList.add(
        "bg-brand",
        "text-white",
        "text-center",
        "p-1",
        "mx-5",
        "my-5",
        "rounded-md",
        "shadow-md",
      );
      link.textContent = "View listing";

      card.appendChild(title);
      card.appendChild(image);
      card.appendChild(link);

      myBidsContainer.appendChild(card);
    });
  } catch (error) {
    console.log(error);
  }
}

getProfile();

import { get, del } from "../service/apiClient.js";
import { name } from "../service/utils.js";

const profileContainer = document.getElementById("profile-container");
const myListingContainer = document.getElementById("my-listings-container");
const myBidsContainer = document.getElementById("my-bids-container");
const myWinsContainer = document.getElementById("auctions-won-container");

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
    user.classList.add("flex");

    const avatar = document.createElement("img");
    avatar.src = profile.avatar.url;
    avatar.alt = profile.avatar.alt;
    avatar.classList.add("h-20", "w-20", "object-cover", "rounded-full");

    const userInfo = document.createElement("div");
    userInfo.classList.add("px-3");

    const userName = document.createElement("h1");
    userName.textContent = profile.name;
    userName.classList.add("font-heading", "font-medium", "text-2xl");

    const userEmail = document.createElement("p");
    userEmail.textContent = profile.email;

    const bio = document.createElement("p");
    bio.textContent = profile.bio || "No bio added";

    const profileBox = document.createElement("div");

    const credit = document.createElement("h2");
    credit.textContent = "Credit: " + profile.credits;
    credit.classList.add(
      "font-heading",
      "font-medium",
      "text-2xl",
      "pl-23",
      "pt-5",
    );

    const editButton = document.createElement("button");
    editButton.textContent = "Edit profile";
    editButton.classList.add("font-heading", "text-brand", "text-xl", "pl-23");

    editButton.addEventListener("click", () => {
      window.location.href = `./editProfile.html?name=${name}`;
    });

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
    profileBox.appendChild(editButton);
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
      noListing.textContent = "You have not created any listings yet";

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
        "p-5",
      );

      const image = document.createElement("img");
      image.src = listing.media?.[0]?.url || "../public/no_image.png";
      image.alt = listing.media?.[0]?.alt || listing.title;
      image.classList.add("h-65", "md:h-100", "lg:h-150", "object-cover");

      const content = document.createElement("div");
      content.classList.add("p-5");

      const title = document.createElement("h3");
      title.textContent = listing.title;
      title.classList.add("font-heading", "font-medium", "text-xl");

      const description = document.createElement("p");
      description.textContent = listing.description || "No description";
      description.classList.add("mt-2");

      const endsAt = document.createElement("p");
      endsAt.textContent = "Ends: " + new Date(listing.endsAt).toLocaleString();
      endsAt.classList.add("mt-3", "text-sm");

      const link = document.createElement("a");
      link.href = `../listings/details.html?id=${listing.id}`;
      link.classList.add(
        "bg-brand",
        "text-white",
        "text-center",
        "p-3",
        "mx-5",
        "my-2",
        "rounded-md",
        "shadow-md",
      );
      link.textContent = "View listing";

      const id = listing.id;

      const editLink = document.createElement("a");
      editLink.href = `../listings/editListing.html?id=${id}`;
      editLink.classList.add(
        "bg-blue-500",
        "text-white",
        "text-center",
        "p-3",
        "mx-5",
        "my-2",
        "rounded-md",
        "shadow-md",
      );
      editLink.textContent = "Edit listing";

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add(
        "text-brand",
        "border",
        "border-brand-700",
        "p-3",
        "mx-5",
        "my-2",
        "rounded-md",
        "shadow-md",
      );
      deleteBtn.textContent = "Delete listing";

      deleteBtn.addEventListener("click", async () => {
        const confirmed = confirm(
          "Are you sure you want to delete this post? This action cannot be undone",
        );
        if (!confirmed) return;

        try {
          const deleteResult = await del(`/auction/listings/${id}`);

          card.remove();

          if (!deleteResult.ok) {
            throw new Error("Failed to delete post");
          }
        } catch (error) {}
      });

      content.appendChild(title);
      content.appendChild(description);
      content.appendChild(endsAt);

      card.appendChild(image);
      card.appendChild(content);
      card.appendChild(link);
      card.appendChild(editLink);
      card.appendChild(deleteBtn);

      myListingContainer.appendChild(card);
    });

    if (bids.length === 0) {
      const noBids = document.createElement("p");
      noBids.textContent = "You have not made any bids yet";

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
        "max-w-320",
        "bg-white",
        "rounded-lg",
        "shadow-md",
        "overflow-hidden",
        "p-5",
      );

      const image = document.createElement("img");
      image.src = listing.media?.[0]?.url || "../public/no_image.png";
      image.alt = listing.media?.[0]?.alt || listing.title;
      image.classList.add("h-65", "md:h-100", "lg:h-150", "object-cover");

      const content = document.createElement("div");
      content.classList.add("p-5");

      const title = document.createElement("h3");
      title.textContent = listing.title;
      title.classList.add("font-heading", "font-medium", "text-xl");

      const description = document.createElement("p");
      description.textContent = listing.description || "No description";
      description.classList.add("mt-2");

      const endsAt = document.createElement("p");
      endsAt.textContent = "Ends: " + new Date(listing.endsAt).toLocaleString();
      endsAt.classList.add("mt-3", "text-sm");

      const link = document.createElement("a");
      link.href = `../listings/details.html?id=${listing.id}`;
      link.classList.add(
        "bg-brand",
        "text-white",
        "text-center",
        "p-3",
        "mx-5",
        "my-2",
        "rounded-md",
        "shadow-md",
      );
      link.textContent = "View listing";

      content.appendChild(title);
      content.appendChild(description);
      content.appendChild(endsAt);

      card.appendChild(image);
      card.appendChild(content);
      card.appendChild(link);

      myBidsContainer.appendChild(card);
    });

    if (profile.wins.length === 0) {
      const noWins = document.createElement("p");
      noWins.textContent = "You have not won any auctions yet";

      myWinsContainer.appendChild(noWins);
    }

    profile.wins.forEach((listing) => {
      const card = document.createElement("div");
      card.classList.add(
        "flex",
        "flex-col",
        "justify-center",
        "bg-white",
        "rounded-lg",
        "shadow-md",
        "overflow-hidden",
      );

      const image = document.createElement("img");
      image.src = listing.media?.[0]?.url || "../public/no_image.png";
      image.alt = listing.media?.[0]?.alt || listing.title;
      image.classList.add(
        "h-65",
        "md:h-100",
        "lg:h-150",
        "object-cover",
        "px-5",
      );

      const content = document.createElement("div");
      content.classList.add("p-5");

      const title = document.createElement("h3");
      title.textContent = listing.title;
      title.classList.add("font-heading", "font-medium", "text-xl");

      const description = document.createElement("p");
      description.textContent = listing.description || "No description";
      description.classList.add("mt-2");

      const endsAt = document.createElement("p");
      endsAt.textContent = "Ends: " + new Date(listing.endsAt).toLocaleString();
      endsAt.classList.add("mt-3", "text-sm");

      const link = document.createElement("a");
      link.href = `../listings/details.html?id=${listing.id}`;
      link.classList.add(
        "bg-brand",
        "text-white",
        "text-center",
        "p-3",
        "mx-5",
        "my-2",
        "rounded-md",
        "shadow-md",
      );
      link.textContent = "View listing";

      content.appendChild(title);
      content.appendChild(description);
      content.appendChild(endsAt);

      card.appendChild(image);
      card.appendChild(content);
      card.appendChild(link);

      myWinsContainer.appendChild(card);
    });
  } catch (error) {
    console.log(error);
  }
}

getProfile();

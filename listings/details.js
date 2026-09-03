import { get } from "../service/apiClient.js";
import { Countdown } from "../service/countdown.js";

const listingContainer = document.getElementById("listing-container");
const card = document.getElementById("card");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("No post ID found");
}

async function getListing() {
  try {
    const result = await get(`/auction/listings/${id}?_seller=true&_bids=true`);
    const listing = result.data;

    const image = document.createElement("img");
    image.src = listing.media?.[0]?.url || "../public/no_image.png";
    image.alt = listing.media?.[0]?.alt || listing.title;
    image.classList.add("h-65", "md:h-100", "lg:h-150", "object-cover", "p-5");
    image.onerror = () => {
      image.src = "../public/no_image.png";
    };

    const title = document.createElement("h1");
    title.textContent = listing.title;
    title.classList.add(
      "font-heading",
      "font-medium",
      "text-2xl",
      "md:text-3xl",
      "text-center",
      "p-5",
    );

    const seller = document.createElement("p");
    seller.textContent = "Seller: " + listing.seller.name;
    seller.classList.add(
      "font-heading",
      "font-medium",
      "text-xl",
      "text-center",
    );

    const created = document.createElement("p");
    created.textContent =
      "Listed: " + new Date(listing.created).toLocaleString();
    created.classList.add("text-center");

    const text = document.createElement("p");
    text.textContent = listing.description;
    text.classList.add("p-10");

    const countdownContainer = document.createElement("div");
    countdownContainer.classList.add(
      "flex",
      "flex-col",
      "sm:flex-row",
      "justify-center",
    );

    const countdownText = document.createElement("p");
    countdownText.textContent = "Auction ends in: ";
    countdownText.classList.add(
      "font-heading",
      "font-medium",
      "text-2xl",
      "text-center",
    );

    const countdown = document.createElement("p");
    countdown.classList.add(
      "font-heading",
      "font-medium",
      "text-2xl",
      "text-center",
      "text-brand",
    );

    Countdown(listing.endsAt, countdown);

    const bidContainer = document.createElement("div");
    bidContainer.classList.add("flex", "justify-between");

    const bids = document.createElement("h3");
    bids.textContent = "Bids: " + listing._count.bids;
    bids.classList.add(
      "font-heading",
      "font-medium",
      "text-2xl",
      "text-brand",
      "p-5",
    );

    const credit = document.createElement("h3");
    credit.textContent = "Credit: " + (listing.bids.at(-1)?.amount ?? 0);
    credit.classList.add(
      "font-heading",
      "font-medium",
      "text-2xl",
      "text-brand",
      "p-5",
    );

    const bidHistory = document.createElement("div");

    const bidHeading = document.createElement("h3");
    bidHeading.textContent = "Bid History:";
    bidHeading.classList.add("font-heading", "font-medium", "text-xl", "p-5");

    if (listing.bids.length === 0) {
      const noBids = document.createElement("p");
      noBids.textContent = "No bids yet";
      noBids.classList.add("bg-brand-100", "p-5");
      bidHistory.appendChild(noBids);
    } else {
      listing.bids
        .slice()
        .reverse()
        .forEach((bids) => {
          const bidList = document.createElement("div");
          bidList.classList.add(
            "grid",
            "sm:grid-cols-3",
            "odd:bg-brand-100",
            "p-5",
          );

          const bidderName = document.createElement("p");
          bidderName.textContent = bids.bidder.name;
          bidderName.classList.add("font-bold");

          const bidAmount = document.createElement("p");
          bidAmount.textContent = "Credits: " + bids.amount;
          bidAmount.classList.add("sm:text-center");

          const bidTime = document.createElement("p");
          bidTime.textContent = new Date(bids.created).toLocaleString();
          bidTime.classList.add("sm:text-right");

          bidList.appendChild(bidderName);
          bidList.appendChild(bidAmount);
          bidList.appendChild(bidTime);

          bidHistory.appendChild(bidList);
        });
    }

    countdownContainer.appendChild(countdownText);
    countdownContainer.appendChild(countdown);

    bidContainer.appendChild(bids);
    bidContainer.appendChild(credit);

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(seller);
    card.appendChild(created);
    card.appendChild(text);
    card.appendChild(countdownContainer);
    card.appendChild(bidContainer);
    card.appendChild(bidHeading);
    card.appendChild(bidHistory);

    listingContainer.appendChild(card);
  } catch (error) {
    console.log(error);
  }
}

getListing();

import { get, post } from "../service/apiClient.js";
import { Countdown } from "../service/countdown.js";
import { getFromLocalStorage } from "../service/utils.js";

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
    image.classList.add(
      "h-65",
      "max-w-80",
      "object-cover",
      "shadow-md",
      "rounded-lg",
      "m-5",
    );
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
      "md:text-left",
    );

    const seller = document.createElement("p");
    seller.textContent = "Seller: " + listing.seller.name;
    seller.classList.add(
      "font-heading",
      "font-medium",
      "text-xl",
      "text-center",
      "md:text-left",
    );

    const created = document.createElement("p");
    created.textContent =
      "Listed: " + new Date(listing.created).toLocaleString();
    created.classList.add("text-center", "md:text-left");

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("md:pr-5", "md:py-15");

    const infoBox = document.createElement("div");
    infoBox.classList.add("flex", "flex-col", "mx-auto", "md:flex-row");

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
      "text-xl",
      "text-center",
    );

    const countdown = document.createElement("p");
    countdown.classList.add(
      "font-heading",
      "font-medium",
      "text-xl",
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

    const currentUser = getFromLocalStorage("name");
    const highestBid = listing.bids.length
      ? Math.max(...listing.bids.map((bid) => bid.amount))
      : 0;

    const bidForm = document.createElement("form");
    bidForm.classList.add("flex", "flex-col", "mx-auto", "gap-3", "p-5");

    const placeBid = document.createElement("div");
    placeBid.classList.add("flex", "flex-row", "py-2");

    const bidLabel = document.createElement("label");
    bidLabel.textContent = `Place a bid higher than ${highestBid} credits`;
    bidLabel.setAttribute("for", "bid-amount");

    const bidInput = document.createElement("input");
    bidInput.type = "number";
    bidInput.id = "bid-amount";
    bidInput.name = "amount";
    bidInput.min = highestBid + 1;
    bidInput.required = true;
    bidInput.classList.add("border", "rounded-l-md", "shadow-md");

    const bidButton = document.createElement("button");
    bidButton.type = "submit";
    bidButton.textContent = "Place bid";
    bidButton.classList.add(
      "bg-brand",
      "text-white",
      "px-5",
      "py-2",
      "rounded-r-md",
      "cursor-pointer",
      "shadow-lg",
    );

    const bidMessage = document.createElement("p");

    placeBid.appendChild(bidInput);
    placeBid.appendChild(bidButton);
    bidForm.appendChild(bidLabel);
    bidForm.appendChild(placeBid);
    bidForm.appendChild(bidMessage);

    bidForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const amount = Number(bidInput.value);

      if (!currentUser) {
        bidMessage.textContent = "You must be logged in to place a bid";
        return;
      }

      if (currentUser === listing.seller.name) {
        bidMessage.textContent = "You cannot bid on your own item";
        return;
      }

      if (amount <= highestBid) {
        bidMessage.textContent = `Your bid must be higher than ${highestBid} credits`;
        return;
      }

      try {
        await post(`/auction/listings/${id}/bids`, {
          amount: amount,
        });

        bidMessage.textContent = "Bid placed successfully";

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        bidMessage.textContent = error.message || "Unable to place bid";
        console.log(error);
      }
    });

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

    infoContainer.appendChild(title);
    infoContainer.appendChild(seller);
    infoContainer.appendChild(created);

    infoBox.appendChild(image);
    infoBox.appendChild(infoContainer);

    countdownContainer.appendChild(countdownText);
    countdownContainer.appendChild(countdown);

    bidContainer.appendChild(bids);
    bidContainer.appendChild(credit);

    card.appendChild(infoBox);
    card.appendChild(text);
    card.appendChild(countdownContainer);
    card.appendChild(bidContainer);
    card.appendChild(bidForm);
    card.appendChild(bidHeading);
    card.appendChild(bidHistory);

    listingContainer.appendChild(card);
  } catch (error) {
    console.log(error);
  }
}

getListing();

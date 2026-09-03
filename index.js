import { get } from "./service/apiClient.js";
import { Countdown } from "./service/countdown.js";

const allItemsContainer = document.getElementById("all-items-container");
const loadMoreButton = document.getElementById("load-more-button");

let currentPage = 1;
let isFetching = false;
let allItems = [];
let filteredItems = [];
let currentSearch = "";

async function getAllItems(page) {
  if (isFetching) return;

  isFetching = true;
  loadMoreButton.textContent = "Loading...";
  loadMoreButton.disabled = true;

  try {
    const response = await get(
      `/auction/listings?_active=true&page=${page}&limit=15&_seller=true&_bids=true`,
    );

    allItems = [...allItems, ...response.data];

    applySearch(currentSearch);

    if (response.meta.isLastPage) {
      loadMoreButton.style.display = "none";
    } else {
      loadMoreButton.textContent = "More items";
      loadMoreButton.disabled = false;
    }
  } catch (error) {
    console.log(error);
    loadMoreButton.textContent = "Failed to load. Try again.";
    loadMoreButton.disabled = false;
  } finally {
    isFetching = false;
  }
}

function renderItems(itemsToRender) {
  allItemsContainer.innerHTML = "";

  if (itemsToRender.length === 0) {
    allItemsContainer.innerHTML = "<p>No items found</p>";
    return;
  }

  itemsToRender.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add(
      "bg-white",
      "p-5",
      "pb-8",
      "shadow-md",
      "flex",
      "flex-col",
      "h-full",
    );

    const title = document.createElement("h3");
    title.textContent = item.title;
    title.classList.add(
      "font-heading",
      "font-medium",
      "text-xl",
      "pb-3",
      "min-h-16",
    );

    const image = document.createElement("img");
    image.src = item.media?.[0]?.url || "../public/no_image.png";
    image.alt = item.media?.[0]?.alt || item.title;

    image.classList.add("w-full", "h-65", "object-cover");

    image.onerror = () => {
      image.src = "../public/no_image.png";
    };

    const bidContainer = document.createElement("div");
    bidContainer.classList.add("flex", "justify-between");

    const bid = document.createElement("h3");
    bid.textContent = "Bids:" + item._count.bids;
    bid.classList.add(
      "font-heading",
      "font-medium",
      "text-xl",
      "text-brand",
      "py-5",
    );

    const credit = document.createElement("p");
    credit.textContent = "Credit: " + (item.bids.at(-1)?.amount ?? 0);
    credit.classList.add(
      "font-heading",
      "font-medium",
      "text-xl",
      "text-brand",
      "py-5",
    );

    const description = document.createElement("p");
    description.textContent = item.description;

    const countdownContainer = document.createElement("div");
    countdownContainer.classList.add(
      "flex",
      "flex-col",
      "sm:flex-row",
      "justify-center",
      "p-5",
      "mt-auto",
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

    Countdown(item.endsAt, countdown);

    const link = document.createElement("a");
    link.href = `./listings/details.html?id=${item.id}`;
    link.textContent = "View listing";
    link.classList.add(
      "bg-brand",
      "w-full",
      "p-3",
      "text-white",
      "font-heading",
      "font-medium",
      "text-xl",
      "text-center",
      "rounded-md",
    );

    bidContainer.appendChild(bid);
    bidContainer.appendChild(credit);
    countdownContainer.appendChild(countdownText);
    countdownContainer.appendChild(countdown);
    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(bidContainer);
    card.appendChild(description);
    card.appendChild(countdownContainer);
    card.appendChild(link);

    allItemsContainer.appendChild(card);
  });
}

function applySearch(searchTerm) {
  currentSearch = searchTerm.toLowerCase().trim();

  if (!currentSearch) {
    filteredItems = [...allItems];
  } else {
    filteredItems = allItems.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";

      return (
        title.includes(currentSearch) || description.includes(currentSearch)
      );
    });
  }

  renderItems(filteredItems);
}

searchInput.addEventListener("input", (event) => {
  applySearch(event.target.value);
});

loadMoreButton.addEventListener("click", () => {
  currentPage++;
  getAllItems(currentPage);
});

getAllItems(currentPage);

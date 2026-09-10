import { get } from "./service/apiClient.js";
import { Countdown } from "./service/countdown.js";

const allItemsContainer = document.getElementById("all-items-container");
const loadMoreButton = document.getElementById("load-more-button");

let currentPage = 1;
let isFetching = false;
let allItems = [];
let filteredItems = [];
let currentSearch = "";
let currentSort = "newest";

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sort-items");

async function getAllItems(page) {
  if (isFetching) return;

  isFetching = true;
  loadMoreButton.textContent = "Loading...";
  loadMoreButton.disabled = true;

  try {
    const response = await get(
      `/auction/listings?_active=true&page=${page}&limit=15&_seller=true&_bids=true&sort=created`,
    );

    allItems = [...allItems, ...response.data];

    applyFilters();

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

    image.classList.add(
      "w-full",
      "h-65",
      "object-cover",
      "rounded-lg",
      "shadow-md",
    );

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
      "text-lg",
      "text-brand",
      "py-3",
    );

    const credit = document.createElement("p");
    credit.textContent = "Credit: " + (item.bids.at(-1)?.amount ?? 0);
    credit.classList.add(
      "font-heading",
      "font-medium",
      "text-lg",
      "text-brand",
      "py-3",
    );

    const countdownContainer = document.createElement("div");
    countdownContainer.classList.add(
      "flex",
      "flex-col",
      "justify-center",
      "p-5",
      "mt-auto",
    );

    const countdownText = document.createElement("p");
    countdownText.textContent = "Auction ends in: ";
    countdownText.classList.add(
      "font-heading",
      "font-regular",
      "text-lg",
      "text-center",
    );

    const countdown = document.createElement("p");
    countdown.classList.add(
      "font-heading",
      "font-medium",
      "text-lg",
      "text-center",
      "text-blue-500",
    );

    Countdown(item.endsAt, countdown);

    const link = document.createElement("a");
    link.href = `./listings/details.html?id=${item.id}`;
    link.textContent = "View listing";
    link.classList.add(
      "bg-brand",
      "w-full",
      "p-2",
      "text-white",
      "font-heading",
      "font-regular",
      "text-md",
      "text-center",
      "rounded-md",
      "shadow-md",
    );

    bidContainer.appendChild(bid);
    bidContainer.appendChild(credit);
    countdownContainer.appendChild(countdownText);
    countdownContainer.appendChild(countdown);
    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(bidContainer);
    card.appendChild(countdownContainer);
    card.appendChild(link);

    allItemsContainer.appendChild(card);
  });
}

function applyFilters() {
  let items = [...allItems];

  if (currentSearch) {
    items = items.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";
      const tags = item.tags?.join(" ").toLowerCase() || "";

      return (
        title.includes(currentSearch) ||
        description.includes(currentSearch) ||
        tags.includes(currentSearch)
      );
    });
  }

  if (currentSort === "newest") {
    items.sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  if (currentSort === "ending") {
    items.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
  }

  filteredItems = items;

  renderItems(filteredItems);
}

searchInput.addEventListener("input", (event) => {
  currentSearch = event.target.value.toLowerCase().trim();
  applyFilters();
});

sortSelect.addEventListener("change", (event) => {
  currentSort = event.target.value;
  applyFilters();
});

loadMoreButton.addEventListener("click", () => {
  currentPage++;
  getAllItems(currentPage);
});

getAllItems(currentPage);

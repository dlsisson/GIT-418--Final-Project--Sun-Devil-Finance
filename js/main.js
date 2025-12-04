"use strict";

// Theme Toggle
function initTheme() {
  const themeButton = document.getElementById("themeToggle");
  if (!themeButton) {
    console.log("Theme button not found");
    return;
  }
  let savedTheme = localStorage.getItem("theme");

  if (!savedTheme) {
    savedTheme = "dark";
  }

  if (savedTheme === "light") {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }

  themeButton.addEventListener("click", function () {
    const isLightMode = document.body.classList.contains("light");
    if (isLightMode === true) {
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  });
}

// Section to Track followed Tickers and save it in the browser
function initFollowedTickers() {
  // get elements from the page
  const form = document.getElementById("followForm");
  const input = document.getElementById("followInput");
  const list = document.getElementById("followList");
  const clearBtn = document.getElementById("clearTickers");

  if (!form || !input || !list) {
    return;
  }
  let saved = localStorage.getItem("tickers");
  let tickers = [];
  if (saved) {
    tickers = JSON.parse(saved);
  }

  for (let i = 0; i < tickers.length; i++) {
    const li = document.createElement("li");
    li.className = "card";
    li.textContent = tickers[i];
    list.appendChild(li);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let symbol = input.value.trim().toUpperCase();
    if (symbol === "") {
      return;
    }
    tickers.push(symbol);
    localStorage.setItem("tickers", JSON.stringify(tickers));
    const li = document.createElement("li");
    li.className = "card";
    li.textContent = symbol;
    list.appendChild(li);

    input.value = "";
  });

  // Clear Tickers
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      tickers = [];
      localStorage.setItem("tickers", JSON.stringify(tickers));
      list.innerHTML = "";
    });
  }
}

// FAQ Accordion
function initFaqAccordion() {
  if (typeof $ === "undefined") {
    console.error("jQuery not loaded, accordion cannot initialize.");
    return;
  }

  $("#faqAccordion").accordion({
    heightStyle: "content",
    collapsible: true,
    active: 0
  });
}

// Carousel Code
function initHeaderCarousel() {
  if (typeof $ === "undefined" || typeof $.fn.slick !== "function") {
    console.error("Slick carousel not loaded.");
    return;
  }

  $(".single-item").slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
    dots: true
  });
}

function loadFeaturedStocks() {
  const container = document.getElementById("featured-stocks");
  if (!container) {
    console.error("#featured-stocks container not found");
    return;
  }

  fetch("data/stocks.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((stocks) => {
      if (!Array.isArray(stocks)) {
        console.error("Featured stocks JSON is not an array");
        return;
      }

      container.innerHTML = stocks
        .map((stock) => {
          return `
            <article class="stock-card">
              <h3 class="stock-card__title">${escapeHtml(stock.symbol)} — ${escapeHtml(stock.name)}</h3>
              <p class="stock-card__price">
                <span class="label">Price:</span>
                <span class="value">$${formatNumber(stock.price)}</span>
                <span class="change">${escapeHtml(stock.change)}</span>
              </p>
              <p class="stock-card__sector">
                <span class="label">Sector:</span> ${escapeHtml(stock.sector)}
              </p>
              <p class="stock-card__summary">${escapeHtml(stock.summary)}</p>
            </article>
          `;
        })
        .join("");
    })
    .catch((error) => {
      console.error("Error loading featured stocks:", error);
      container.innerHTML = `<p class="error-message">Unable to load featured stocks right now.</p>`;
    });
}

// Helpers to make sure cards's prices are correctly structured
function formatNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[ch])
  );
}

// Init Section
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFaqAccordion();
  initHeaderCarousel();
  loadFeaturedStocks();
  initFollowedTickers();
});

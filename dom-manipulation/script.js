const newQuote = document.getElementById("newQuote");

const Quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: '"Behind every great man is a women rolling her eyes."',
    category: "Sarcasm",
  },

  {
    text: '"Prejudice is a great time saver. You can form opinions with out having to get the facts."',
    category: "Life",
  },

  {
    text: '"Whether forecast for tonight: dark."',
    category: "Sarcasm",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  showRandomQuote();

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    document.getElementById("categoryFilter").value = savedCategory;
    filterQuotes();
  }
});

function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomQuote = Math.floor(Math.random() * Quotes.length);
  quoteDisplay.innerHTML = `<p>${Quotes[randomQuote].text}</p>`;
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(Quotes.map((quote) => quote.category))];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

newQuote.addEventListener("click", showRandomQuote);

const createAddQuoteForm = function () {
  const Form = document.createElement("form");
  Form.innerHTML = `<input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input
      id="newQuoteCategory"
      type="text"
      placeholder="Enter quote category"
    />
    <button onclick="addQuote()">Add Quote</button><br><br>`;

  document.body.appendChild(Form);
};

createAddQuoteForm();

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    Quotes.push({ text: newQuoteText, category: newQuoteCategory });
    populateCategories();
    alert("Quote added successfully!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both a quote and a category");
  }

  saveQuotes();
}

function getFilteredQuotes() {
  const selectedCategory = document.getElementById(categoryFilter).value;
  if (selectedCategory === "all") {
    return Quotes;
  }
  return Quotes.filter((quote) => quote.category === selectedCategory);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    Quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(Quotes));
}

function exportToJson() {
  const dataStr = JSON.stringify(Quotes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

// Function to periodically fetch data
function startPeriodicFetch(interval = 60000) {
  setInterval(async () => {
    const serverQuotes = await fetchQuotesFromServer();
    syncWithServer(serverQuotes);
  }, interval);
}

// Function to sync local data with server data
function syncWithServer(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
}

// Function to merge local and server quotes
function mergeQuotes(localQuotes, serverQuotes) {
  const serverIds = new Set(serverQuotes.map((quote) => quote.id));
  const newLocalQuotes = localQuotes.filter(
    (quote) => !serverIds.has(quote.id)
  );
  return [...newLocalQuotes, ...serverQuotes];
}

// Function to notify users of updates
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerText = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

// Enhanced sync function with notifications
function syncWithServer(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  notifyUser("Quotes synced with server!");
}
// Option for manual conflict resolution (UI logic needs to be implemented)
function manualConflictResolution() {
  // Implement UI logic for manual conflict resolution
}

// Test fetching and syncing
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  syncWithServer(serverQuotes);
}

// Add a call to syncQuotes in the periodic fetch setup
function startPeriodicFetch(interval = 60000) {
  setInterval(async () => {
    await syncQuotes();
  }, interval);
}

// Initial call to sync quotes when the script loads
syncQuotes();

document
  .getElementById("quoteForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const quoteText = document.getElementById("quoteText").value;
    if (quoteText) {
      const newQuote = {
        title: quoteText,
        body: quoteText,
        userId: 1,
      };
      const postedQuote = await postQuoteToServer(newQuote);
      if (postedQuote) {
        const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
        localQuotes.push(postedQuote);
        localStorage.setItem("quotes", JSON.stringify(localQuotes));
        notifyUser("New quote added successfully.");
        document.getElementById("quoteForm").reset();
      }
    }
  });

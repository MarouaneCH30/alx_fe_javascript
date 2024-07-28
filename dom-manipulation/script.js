let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
  // Add more quotes as needed
];

const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Example URL

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = quotes[randomIndex].text;
}

// Add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    alert("New quote added successfully!");

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    populateCategories();
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(quote => quote.category))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (selectedCategory === "all") {
    quoteDisplay.textContent = quotes.map(quote => quote.text).join("\n");
  } else {
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    quoteDisplay.textContent = filteredQuotes.map(quote => quote.text).join("\n");
  }

  localStorage.setItem("selectedCategory", selectedCategory);
}

// Load selected category from local storage
function loadSelectedCategory() {
  const selectedCategory = localStorage.getItem("selectedCategory");
  if (selectedCategory) {
    document.getElementById("categoryFilter").value = selectedCategory;
    filterQuotes();
  }
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = 'quotes.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
    populateCategories();
    filterQuotes();
  };
  fileReader.readAsText(event.target.files[0]);
}

// Resolve conflicts between local and server quotes
function resolveConflicts(localQuotes, serverQuotes) {
  const mergedQuotes = [...new Set([...localQuotes, ...serverQuotes])];
  return mergedQuotes;
}

// Sync quotes with server
async function syncWithServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    quotes = resolveConflicts(quotes, serverQuotes);
    saveQuotes();
    alert('Data synced with server successfully!');
    populateCategories();
    filterQuotes();
  } catch (error) {
    console.error('Error syncing with server:', error);
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  loadSelectedCategory();
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
});

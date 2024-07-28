document.addEventListener('DOMContentLoaded', () => {
  // Load quotes from local storage or initialize with default quotes
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Good, better, best. Never let it rest. 'Til your good is better and your better is best.", category: "Improvement" },
  ];

  // Select DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const addQuoteButton = document.getElementById('addQuoteButton');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const exportQuotesButton = document.getElementById('exportQuotes');
  const importFileInput = document.getElementById('importFile');

  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
    // Save the last viewed quote in session storage
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  }

  // Function to add a new quote
  function addQuote() {
    const quoteText = newQuoteText.value.trim();
    const quoteCategory = newQuoteCategory.value.trim();

    // Validate input
    if (quoteText && quoteCategory) {
      // Add new quote to the array
      quotes.push({ text: quoteText, category: quoteCategory });

      // Save quotes to local storage
      saveQuotes();

      // Clear input fields
      newQuoteText.value = '';
      newQuoteCategory.value = '';

      alert('Quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  // Function to save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  // Function to export quotes to a JSON file
  function exportQuotes() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // Event listeners
  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);
  exportQuotesButton.addEventListener('click', exportQuotes);
  importFileInput.addEventListener('change', importFromJsonFile);

  // Load the last viewed quote from session storage
  const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
  if (lastQuote) {
    quoteDisplay.innerHTML = `"${lastQuote.text}" - <em>${lastQuote.category}</em>`;
  }
});

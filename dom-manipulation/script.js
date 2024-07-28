document.addEventListener('DOMContentLoaded', () => {
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
  const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const addQuoteButton = document.getElementById('addQuoteButton');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const exportQuotesButton = document.getElementById('exportQuotes');
  const importFileInput = document.getElementById('importFile');
  const categoryFilter = document.getElementById('categoryFilter');
  const notification = document.getElementById('notification');

  function populateCategories() {
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
    categoryFilter.value = lastSelectedCategory;
  }

  function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategory', selectedCategory);
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    displayQuotes(filteredQuotes);
  }

  function displayQuotes(quotesToDisplay) {
    quoteDisplay.innerHTML = quotesToDisplay.map(quote => `<p>"${quote.text}" - <em>${quote.category}</em></p>`).join('');
  }

  function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  }

  function addQuote() {
    const quoteText = newQuoteText.value.trim();
    const quoteCategory = newQuoteCategory.value.trim();
    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
      saveQuotes();
      populateCategories();
      filterQuotes();
      newQuoteText.value = '';
      newQuoteCategory.value = '';
      syncWithServer(); // Sync after adding a new quote
      alert('Quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

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

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      syncWithServer(); // Sync after importing quotes
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

  function syncWithServer() {
    // Fetch latest quotes from server
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(serverQuotes => {
        const newQuotes = serverQuotes.filter(sq => !quotes.some(lq => lq.text === sq.text));
        quotes.push(...newQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        notification.textContent = 'Quotes synced with server.';
        setTimeout(() => notification.textContent = '', 3000);
      })
      .catch(error => console.error('Error syncing with server:', error));
  }

  function periodicSync() {
    setInterval(syncWithServer, 30000); // Sync every 30 seconds
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);
  exportQuotesButton.addEventListener('click', exportQuotes);
  importFileInput.addEventListener('change', importFromJsonFile);
  categoryFilter.addEventListener('change', filterQuotes);

  populateCategories();
  filterQuotes();

  const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
  if (lastQuote) {
    quoteDisplay.innerHTML = `"${lastQuote.text}" - <em>${lastQuote.category}</em>`;
  }

  periodicSync(); // Start periodic syncing
});

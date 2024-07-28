document.addEventListener('DOMContentLoaded', () => {
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const addQuoteButton = document.getElementById('addQuoteButton');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');

  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = 'No quotes available.';
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
  }

  function addQuote() {
    const quoteText = newQuoteText.value.trim();
    const quoteCategory = newQuoteCategory.value.trim();
    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
      saveQuotes();
      newQuoteText.value = '';
      newQuoteCategory.value = '';
      alert('Quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);

  // Initialize with a random quote if quotes exist
  if (quotes.length > 0) {
    showRandomQuote();
  }
});

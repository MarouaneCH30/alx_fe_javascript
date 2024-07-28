document.addEventListener('DOMContentLoaded', () => {
  // Initial quotes array
  const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Good, better, best. Never let it rest. 'Til your good is better and your better is best.", category: "Improvement" },
  ];

  // Select DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');

  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
  }

  // Function to dynamically create the form for adding a new quote
  function createAddQuoteForm() {
    const formContainer = document.createElement('div');

    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.id = 'addQuoteButton';
    addButton.textContent = 'Add Quote';

    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);

    document.body.appendChild(formContainer);

    // Add event listener to the add quote button
    addButton.addEventListener('click', addQuote);
  }

  // Function to add a new quote
  function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    // Validate input
    if (quoteText && quoteCategory) {
      // Add new quote to the array
      quotes.push({ text: quoteText, category: quoteCategory });

      // Clear input fields
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';

      alert('Quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  // Event listeners
  newQuoteButton.addEventListener('click', showRandomQuote);

  // Create the form for adding new quotes
  createAddQuoteForm();
});

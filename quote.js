const quotes = [
    "Adventure is worthwhile in itself. - Amelia Earhart",
    "Traveling – it leaves you speechless, then turns you into a storyteller. - Ibn Battuta",
    "The journey of a thousand miles begins with a single step. - Lao Tzu",
    "A journey is best measured in friends, rather than miles. - Tim Cahill",
    "Fill your life with experiences, not things. Have stories to tell, not stuff to show.",
    "To travel is to discover that everyone is wrong about other countries. - Aldous Huxley",
    // Add more quotes as needed
];

// Function to display a random quote
function displayRandomQuote() {
    const quoteContainer = document.getElementById("quote-text");
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteContainer.textContent = quotes[randomIndex];
}

// Display a random quote when the page loads
displayRandomQuote();
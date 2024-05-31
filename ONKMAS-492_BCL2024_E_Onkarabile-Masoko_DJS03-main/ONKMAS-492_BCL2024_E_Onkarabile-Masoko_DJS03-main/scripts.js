 /**
 * This module sets up the event listeners and functionality for the book preview and search features of the application.
 *
 * It imports the necessary modules and data, creates instances of the `BookPreview`, `ThemeSwitcher`, and `BookSearcher` components,
 * and sets up the event listeners for the search functionality and the "Show More" button.
 *
 * The `addEventListeners()` function is responsible for setting up the event listeners and handling the search and "Show More" functionality.
 */

import { books, authors, genres, booksPerPage } from "./modules/data.js";

import {
  handleElementClickEvent,
  generateDocumentFragments,
} from "./modules/app.js";

import { BookPreview } from "./component/booklist.js";
import { default as ThemeSwitcher } from "./component/theme.js";
import { default as BookSearcher } from "./component/search.js";

// Initialize page variable
let page = 1;

// Create a new instance of BookPreview with the provided data and element ID
const bookPreview = new BookPreview(
    books,
    genres,
    authors,
    booksPerPage,
    page,
  "book-list-preview"
);

// Create a new instance of BookSearcher and assign it to bookSearcher variable
const bookSearcher = new BookSearcher("[data-header-button]"),
  bookSeacherElements = bookSearcher.elements;

// Create a new instance of ThemeSwitcher with the provided selector
new ThemeSwitcher("[data-header-button]");

// Get the listItemsElement from the bookPreview instance
const listItemsElement = bookPreview.listItemsElement;

// Generate document fragments for genreHtml, authorsHtml, newItems, and fragment
const [genreHtml, authorsHtml, newItems, fragment] =
  generateDocumentFragments(5);

// Define searchFormInputs object with genre and author properties
const searchFormInputs = {
  genres: {
    textContent: "All Genres",
    attribute: "[data-search-genres]",
  },
  authors: {
    textContent: "All Authors",
    attribute: "[data-search-authors]",
  },
};

// Function to add event listeners
function addEventListeners() {
  // Add click event listener to the element with data-header-search attribute
  handleElementClickEvent(
    document.querySelector("[data-header-search]"),
    () => {
      // Show the book searcher overlay modal
      bookSearcher.overlayModal(true);
      // Set the search form options for genres
      bookSearcher.searchFormOptions(
        genreHtml,
        searchFormInputs.genres,
        genres
      );
      // Set the search form options for authors
      bookSearcher.searchFormOptions(
        authorsHtml,
        searchFormInputs.authors,
        authors
      );
      // Get the search form element
      const searchForm = document.querySelector("[data-search-form]");

      // Handle the search form submit event
      bookSearcher.handleSearchFormSubmit(searchForm, (event) => {
        event.preventDefault();
        // Search for books based on the form input and display them
        const booksRemaining = bookPreview.searchDisplayBooks({
          event,
          books,
          page,
          booksPerPage,
          newItems,
          listItemsElement,
          searchOverlay: bookSeacherElements.searchOverlay,
        });

        // Show the "show more" button based on whether there are more books remaining
        bookPreview.showMoreButton(booksRemaining.status, booksRemaining.page);
        // Hide the book searcher overlay modal
        bookSearcher.showOverlayModal(false);
      });
    }
  );
}

// Add click event listener to the bookPreview.listButton element
handleElementClickEvent(bookPreview.listButton, () => {
  // Calculate the next list number based on the current page and booksPerPage
  const nextListNumber = (page + 1) * booksPerPage;
  // Get the books to display in the next list
  const listBooksPerPage = books.slice(page * booksPerPage, nextListNumber);
  // Call the createBookList method of the bookPreview instance, passing the listBooksPerPage, booksPerPage, and fragmentElement as arguments
  bookPreview.createBookList({
    books: listBooksPerPage,
    booksPerPage,
    fragmentElement: fragment,
  });

  // Increment the page variable by 1
  page += 1;

  // Calculate whether there are more books remaining based on the length of the books array and the calculated nextListNumber
  const hasBooksRemaining = books.length - nextListNumber >= booksPerPage;

  // Call the showMoreButton method of the bookPreview instance, passing the hasBooksRemaining and page as arguments
  bookPreview.showMoreButton(hasBooksRemaining, page);
});

// Call the addEventListeners function to add the event listener to the bookPreview.listButton element
addEventListeners();

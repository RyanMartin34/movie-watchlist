const userSearchForm = document.getElementById("user-search-form");
const userSearchInput = document.getElementById("user-search-input");
const searchResultsContainer = document.getElementById(
  "search-results-container",
);

userSearchForm.addEventListener("submit", searchMovies);
async function searchMovies(event) {
  event.preventDefault();
  const userQuery = userSearchInput.value.trim();

  if (!userQuery) {
    return;
  }

  const response = await fetch(
    `http://www.omdbapi.com/?apikey=6ac59585&s=${encodeURIComponent(userQuery)}`,
  );

  const searchResultdata = await response.json();

  if (!searchResultdata.Search) {
    searchResultsContainer.innerHTML = `
    <p class="no-results">No results found.</p>
    `;
    return;
  }

  const movieIds = searchResultdata.Search.map(function (movie) {
    return movie.imdbID;
  });

  renderMovies(movieIds);
}

async function renderMovies(movieIds) {
  let html = "";

  const movies = await Promise.all(
    movieIds.map(async function (movieId) {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=6ac59585&i=${movieId}`,
      );

      return response.json();
    }),
  );

  movies.forEach(function (movie) {
    html += `
    <div class="search-result-item">
        <img class="search-result-image" src="${movie.Poster}">
        <div class="search-result-details">
            <div class="search-result-heading">
            <h3>${movie.Title}</h3>
            <p>⭐️ ${movie.imdbRating}</p>
            </div>

            <div class="search-result-subheading">
                <p>${movie.Runtime}</p>
                <p>${movie.Genre}</p>
                <div class="search-result-watchlist">
                    <button class="watchlist-btn" data-id="${movie.imdbID}">Add To Watchlist</button>
                </div>
            </div>

            <p class="search-result-description">${movie.Plot}</p>
        </div>
    </div>
    `;
  });
  searchResultsContainer.innerHTML = html;
  const watchlistBtn = document.querySelectorAll(".watchlist-btn");
  watchlistBtn.forEach(function (button) {
    button.addEventListener("click", addToWatchlist);
  });
}

async function addToWatchlist(event) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const buttonPressed = event.target;
  const movieId = event.target.dataset.id;
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=6ac59585&i=${movieId}`,
  );

  const movie = await response.json();

  const checkIfAdded = watchlist.some(function (item) {
    return item.imdbID === movie.imdbID;
  });

  if (!checkIfAdded) {
    watchlist.push(movie);
  }

  buttonPressed.textContent = "Added";
  buttonPressed.disabled = true;
  buttonPressed.style.cursor = "not-allowed";

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

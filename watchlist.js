const watchlistResultsContainer = document.getElementById(
  "watchlist-results-container",
);

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

function renderWatchlist() {
  if (!watchlistResultsContainer) return;

  if (watchlist.length === 0) {
    watchlistResultsContainer.innerHTML = `
  <div class="no-results">
        <p>Your watchlist is looking a little empty...</p>
        <a class="no-results-add-a" href="index.html">
            <div class="no-results-add">
                <p>Let's add some Movies</p>
            </div>
        </a>
    </div>
    `;
    return;
  }

  watchlistResultsContainer.innerHTML = watchlist
    .map(function (movie) {
      return `
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
                    <button class="remove-btn" data-id="${movie.imdbID}">Remove</button>
                </div>
            </div>

            <p class="search-result-description">${movie.Plot}</p>
        </div>
    </div>
    `;
    })
    .join("");

  const removeBtn = document.querySelectorAll(".remove-btn");
  removeBtn.forEach(function (removeBtn) {
    removeBtn.addEventListener("click", removeFromWatchlist);
  });
}

function removeFromWatchlist(event) {
  const clickedId = event.target.dataset.id;

  watchlist = watchlist.filter(function (movie) {
    return movie.imdbID !== clickedId;
  });

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderWatchlist();
}

renderWatchlist();

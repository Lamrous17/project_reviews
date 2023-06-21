const list = document.querySelector(".movies-list");
const loadMoreBtn = document.querySelector(".load-more");
const searchForm = document.querySelector(".search-form");

let loadPage = 1;
searchForm.addEventListener("submit", makeSearchList);

async function getMovies(query, page = 1) {
  const searchParams = new URLSearchParams({
    api_key: "2de054a07ae490574e29d3b99d4d100e",
    query: query,
    page: page,
  });
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?${searchParams}`
    );
    if (response.status === 404) {
      throw new Error();
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return alert("Test");
  }
}

async function getTrendsList(page = 1) {
  const searchParams = new URLSearchParams({
    api_key: "2de054a07ae490574e29d3b99d4d100e",
    page: page,
  });
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?${searchParams}`
    );
    if (response.status === 404) {
      throw new Error();
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return alert("Test");
  }
}

function makeMarkup(data) {
  const movies = data
    .map((movie) => {
      return `<li class='movie-item'>
      <img class='movie-poster' src=https://image.tmdb.org/t/p/original${
        movie.poster_path
      } alt=${movie.title}/>
      
      <h2 class='movie-title'>${movie.title}</h2>
      <p class='movie-vote'>${movie.vote_average.toFixed(1)}</p>
      </li>`;
    })
    .join("");
  return movies;
}

async function loadMore() {
  loadPage += 1;
  const searchQuery = searchForm.elements.searchQuery.value.trim();
  if (searchQuery) {
    await getMovies(searchQuery, loadPage).then((resp) => {
      if (!resp.results.length) return alert("Out of movies");
      const movies = makeMarkup(resp.results);
      return list.insertAdjacentHTML("beforeend", movies);
    });
  } else {
    await getTrendsList(loadPage).then((resp) => {
      if (!resp.results.length) return alert("Out of movies");
      const movies = makeMarkup(resp.results);
      return list.insertAdjacentHTML("beforeend", movies);
    });
    list.insertAdjacentHTML("beforeend", movies);
  }
}

async function makeList() {
  const movies = await getTrendsList().then((resp) => {
    if (!resp.results.length) return alert("Something went wrong");
    return makeMarkup(resp.results);
  });
  list.innerHTML = movies;
  loadMoreBtn.style.display = "block";
  loadMoreBtn.addEventListener("click", loadMore);
}

async function makeSearchList(evt) {
  evt.preventDefault();
  loadPage = 1;
  await getMovies(evt.target.elements.searchQuery.value.trim()).then((resp) => {
    if (!resp.results.length) return alert("Use another query");
    const movies = makeMarkup(resp.results);
    return (list.innerHTML = movies);
  });
}

makeList();

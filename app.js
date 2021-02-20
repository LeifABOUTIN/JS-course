const apiKey = "563492ad6f91700001000001552795a9259b48ce9b507ec5fc5819ff";
const curatedEndpoint = `https://api.pexels.com/v1/curated`;
const searchEndpoint = "https://api.pexels.com/v1/search";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

//event listeners
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});
more.addEventListener("click", loadMore);

async function dataFetchingPexelAPI(url) {
  const fetchData = await fetch(url, {
    headers: {
      "content-type": "application/json",
      Authorization: apiKey,
    },
  });
  const Data = await fetchData.json();
  return Data;
}

function generatingPicture(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
    <div class="gallery-info">
    <p> ${photo.photographer}</p>
    <a href=${photo.src.original}>Download</a>
    </div>
    <img src=${photo.src.large}></img>
    
    `;
    gallery.appendChild(galleryImg);
  });
}
function updateInput(e) {
  searchValue = e.target.value;
}
async function getCuratedPhotos() {
  fetchLink = curatedEndpoint;
  const data = await dataFetchingPexelAPI(fetchLink);
  generatingPicture(data);
}

async function searchPhotos(input) {
  clearSomeSpace();
  fetchLink = `${searchEndpoint}?query=${input}+query&per_page=15&page=${page}`;
  const data = await dataFetchingPexelAPI(fetchLink);
  generatingPicture(data);
}

function clearSomeSpace() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

async function loadMore() {
  page++;
  if (searchValue) {
    fetchLink = `${searchEndpoint}?query=${searchValue}+query&per_page=15&page=${page}`;
  } else {
    fetchLink = `${curatedEndpoint}?per_page=15&page=${page}`;
  }
  const data = await dataFetchingPexelAPI(fetchLink);
  generatingPicture(data);
}
getCuratedPhotos();

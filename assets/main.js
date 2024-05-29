const cardsContainers = document.querySelector(".card-container");
const btnContainer = document.querySelector(".pagination");
const prevBTN = document.querySelector(".left");
const nextBTN = document.querySelector(".right");
const pageNumber = document.querySelector(".page-number");
const filterContainer = document.querySelector(".filter-container");
const filterButtons = document.querySelectorAll(".btn");

const imgBaseUrl = "https://image.tmdb.org/t/p/original";


//Objeto controlador.
const appState = {
    page: null,
    total: null,
    searchParameter: TRENDING,
}


const showmovies = async () => {
    cardsContainers.innerHTML = renderLoader();
    const movies = await fetchMovies(appState.searchParameter)
    console.log(movies);
    appState.total = movies.total_pages;
    appState.page = movies.page;
    setPaginationState();
    renderCards(movies.results);
};

const setPaginationState = () => {
    pageNumber.innerHTML = appState.page;
    togglePrevBtn(appState.page);
    toggleNextBtn(appState.page, appState.total);
};

const togglePrevBtn = (page) => {
    if(page === 1) {
        prevBTN.classList.add("disabled")
    } else {
        prevBTN.classList.remove("disabled");
    }
};

const toggleNextBtn = (page, total) => {
    if(page === total) {
        nextBTN.classList.add("disabled");
    } else {
        nextBTN.classList.remove("disabled");
    }
};

const renderCards = (movies) => {
    cardsContainers.innerHTML = movies.map((movie) => {
        return createCardTemplate(movie);
    }).join("")
}

const createCardTemplate = (movie) => {
    const {title, poster_path, vote_average, release_date, id} = movie;

    return `
    <div class="card" id=${id}>
        <img src=${
            poster_path 
            ? imgBaseUrl + poster_path 
            : "./assets/img/watching-a-movie_4221419.png" 
        }
            alt=${title} class="card-img">
        <div class="card-popularity">${formateVoteAverage(vote_average)}% de popularidad</div>
        <div class="card-content">
            <h4>${title}</h4>
            <p>Fecha de estreno: ${formatDate(release_date)}</p>
        </div>
    </div>
    `
};

const formateVoteAverage = (voteAverage) => {
    return Math.floor(voteAverage * 10);
};

const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`
}

const renderLoader = () => {
    return `
    <div class="loader">
        <div data-glitch="Loading..." class="glitch">Loading...</div>
    </div>
    `
}

//Validacion para que el ussuario no modifique el codigo
const nextPage = () => {
    if (appState.page === appState.total) {
        return;
    }
    appState.page += 1;
    changePage();
};

const previousPage = () => {
    if (appState.page === 1) return;
    appState.page -= 1;
    changePage();
}

const changePage = async () => {
    cardsContainers.innerHTML = renderLoader();
    const movies = await fetchMovies(appState.searchParameter, appState.page);
    setPaginationState();
    loadingShow(movies);
}

const loadingShow = (movies) => {
    setTimeout(() => {
        renderCards(movies.results);
        filterContainer.scrollIntoView({
            behavior: "smooth",
        })
    }, 1500);
};

const changeSearchParameter = (e) => {
    if(isActiveBtn(e.target)) return;
    const selectedParameter = e.target.dataset.filter;
    appState.searchParameter = parameterSelector(selectedParameter);
    setActiveButton(selectedParameter);
    showmovies();
};

const setActiveButton = (selectedParameter) => {
    const buttons = [...filterButtons];
    buttons.forEach((btn) => {
        if(btn.dataset.filter !== selectedParameter) {
            btn.classList.remove("btn--active")
        } else {
            btn.classList.add("btn--active");
        }
    });
};

const parameterSelector = (filterType) => {
    return filterType === "TOPRATED" 
    ? TOPRATED : 
    filterType === "UPCOMING" 
    ? UPCOMING 
    : TRENDING; 
};

const isActiveBtn = (btn) => {
    return btn.classList.contains("btn") && btn.classList.contains("btn--active");
};

const init = () => {
    window.addEventListener("DOMContentLoaded", showmovies);
    nextBTN.addEventListener("click", nextPage);
    prevBTN.addEventListener("click", previousPage)
    filterContainer.addEventListener("click", changeSearchParameter);
};

init();
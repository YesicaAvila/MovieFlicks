const seriesContainers = document.querySelector(".series-container");
const btnPagination = document.querySelector(".pagination-series");
const prevBtn = document.querySelector(".left");
const nextBtn = document.querySelector(".right");
const pageNumber = document.querySelector(".page-number");
const filterContainer = document.querySelector(".filter-serie");
const btnFilter = document.querySelectorAll(".btn");

const imgBaseUrl = "https://image.tmdb.org/t/p/original";

// 1. Controladores
const appStates = {
    page : null,
    total: null,
    searchParameter: ONAIR,
}

// 2.
const showSeries = async () => {
    //4.Inserta el loader en el card de series
    seriesContainers.innerHTML = rendLoader();
    //5. Me traigo el fetch. Const series devuelve el array de series en consola
    const series = await fetchSeries(appStates.searchParameter);
    console.log(series);
    appStates.total = series.total_pages;
    //actualiza su estado. Aparecera en pagina 1:
    appStates.page = series.page;
    setPaginationState();
    rendCards(series.results);
}

const setPaginationState = () => {
    pageNumber.innerHTML = appStates.page;
    togglePreviousBtn(appStates.page);
    toggleNextBtn(appStates.page, appStates.total);
};

const togglePreviousBtn = (page) => {
    if (page === 1) {
        prevBtn.classList.add("disabled")
    } else {
        prevBtn.classList.remove("disabled");
    }
};

const toggleNextBtn = (page, total) => {
    if (page === total) {
        nextBtn.classList.add("disabled")
    } else {
        nextBtn.classList.remove("disabled");
    }
};

//4.Template
const rendCards = (series) => {
    seriesContainers.innerHTML = series.map((serie) => {
        return createSerieTemplate(serie)
    }).join("")
}
//5.Template 2
const createSerieTemplate = (serie) => {
    const {id, name, poster_path, vote_average, first_air_date} = serie;
    return `
    <div class="cards">
        <img src=${poster_path 
            ? imgBaseUrl + poster_path 
            : "../img/watching-a-movie_4221419.png"}
            alt="${name}" class="img-card">
        <div class="card-popular">${changeVoteAverage(vote_average)}% de popularidad</div>
        <div class="cards-content">
            <h4>${name}</h4>
            <p>Fecha de estreno: ${changeDate(first_air_date)}</p>
        </div>
    </div> 
    `
};
//7.
const changeDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`
};
//6.
const changeVoteAverage = (voteAverage) => {
    return Math.floor(voteAverage * 10)
};

//3. loader
const rendLoader = () => {
    return `
    <div class="loader">
        <div data-glitch="Loading..." class="glitch">Loading...</div>
    </div>`
};

const nextPage = () => {
    if (appStates.page === appStates.total) {
        return;
    }
    appStates.page += 1;
    changePage();
};

//boton "pagina anterior". Video: 1.17.07
const  previousPage = () => {
    if (appStates.page === 1) return;
    appStates.page -= 1;
    changePage();
};

const changePage = async () => {
    seriesContainers.innerHTML = rendLoader();
    const series = await fetchSeries(appStates.searchParameter, appStates.page);
    setPaginationState();
    loadAndShow(series);
};

const loadAndShow = (series) => {
    setTimeout(() => {
        rendCards(series.results);
        filterContainer.scrollIntoView({
            behavior: "smooth"
        })
    }, 1500)
}

const changeSearchParameter = (e) => {
    if (activeBtn(e.target)) return;
    const selectedParameter = e.target.dataset.filter;
    appStates.searchParameter = parameterSelector(selectedParameter) 
    setActiveButton(selectedParameter);
    showSeries();
};

const setActiveButton = (selectedParameter) => {
    //Los botones los transformamos en array. Para usar sus funciones
    const buttons = [...btnFilter];
    buttons.forEach((btn) => {
        if (btn.dataset.filter !== selectedParameter) {
            btn.classList.remove("btn-active")
        } else {
            btn.classList.add("btn-active");
        }
    })
};

const parameterSelector = (filterType) => {
    return filterType === "ONAIR" 
    ? ONAIR 
    : filterType === "POPULAR"
    ? POPULAR
    : TOPRATED;
};

const activeBtn = (btn) => {
    return btn.classList.contains("btn") && btn.classList.contains("btn-active")
}

//Falta cambiar el filtro a searchParameter. Video: 1.22.41
const init = () => {
    window.addEventListener("DOMContentLoaded", showSeries);
    nextBtn.addEventListener("click", nextPage);
    prevBtn.addEventListener("click", previousPage);
    filterContainer.addEventListener("click", changeSearchParameter);
}

init();
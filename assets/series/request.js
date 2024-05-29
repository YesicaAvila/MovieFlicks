const KEY= "fc387ba24049f48b643c17f53665e462";
const ONAIR = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${KEY}&language=en-US`;
const POPULAR = `https://api.themoviedb.org/3/tv/popular?api_key=${KEY}&language=en-US`;
const TOPRATED = `https://api.themoviedb.org/3/tv/top_rated?api_key=${KEY}&language=en-US`;

const fetchSeries = async (searchTerms, page = 1) => {
    try {
        const response = await fetch(searchTerms + `&page=${page}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(`Error en ${error}`)
    }
};
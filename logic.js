const apiKey = "4236bf3a";
const apiUrl = "https://www.omdbapi.com/";

// Обработчик события по загрузке страницы
window.addEventListener("load", () => {
    // Поиск формы "поиска" по id (searchForm)
    const searchForm = document.querySelector("#searchForm");

    // Обработчик события отправки формы
    searchForm.addEventListener("submit", (event) => {
        // Отмена отправки формы по умолчанию (чтобы страница не слетала после поиска)
        event.preventDefault();

        // Получение значения поля ввода "title" из формы
        const title = new FormData(searchForm).get("title");

        // Вызов функции поиска информации о фильме
        fetchMovieInfo(title)
            .then((movieData) => displayMovieInfo(movieData)) // Если данные получены успешно, отображение
            .catch((error) => showError(error)); // Если произошла ошибка, отображение ошибки
    });
});

// Получение информации о фильме по названию
const fetchMovieInfo = (title) => {
    // Промис с результатом выполнения запроса к omdb api
    return fetch(`${apiUrl}?t=${title}&apikey=${apiKey}`)
        .then((response) => {
            // Если ответ не успешный --> ошибка
            if (!response.ok) {
                throw new Error("Не удалось получить данные о фильме");
            }
            // Преобразуем ответ в JSON
            return response.json();
        })
        .then((data) => {
            // Если не найден фильм, ошибка с сообщением из ответа
            if (data.Response === "False") {
                throw new Error(data.Error);
            }
            // Данные о фильме в data возвращаются для обработки
            return data;
        });
};

// Сборка html вставки
const displayMovieInfo = (data) => {
    
    const movieDetails = `
        <div style="text-align: center;">
            <h2>${data.Title}</h2>
        </div>
        <div style="display: flex; justify-content: center;">
            <img src="${data.Poster}" alt="${data.Title}">
        </div>
        <p><strong>Год выпуска:</strong> ${data.Year}</p>
        <p><strong>Жанр:</strong> ${data.Genre}</p>
        <p><strong>Режиссер:</strong> ${data.Director}</p>
        <p><strong>Актеры:</strong> ${data.Actors}</p>
        <p><strong>Описание:</strong> ${data.Plot}</p>
    `;
    
    document.querySelector("#movieInfo").innerHTML = movieDetails;
};

// Отображение ошибок на странице
const showError = (error) => {
    // Сообщение об ошибке в элементе с ID "movieInfo"
    document.querySelector("#movieInfo").innerHTML = `<p>${error.message}</p>`;
};

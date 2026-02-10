async function fetchRandomPerson() {
  try {
    const response = await fetch(
      "https://randomuser.me/api/?inc=gender,name,location,dob,picture,nat",
    );

    const data = await response.json();
    const person = data.results[0];

    return person;
  } catch (error) {
    console.error("Error fetching random person:", error);
  }
}

async function fetchWeather(city) {
  try {
    const apiKey = "22819d3a541742b6b0a235958260502";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

async function fetchNews(countryCode) {
  try {
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    const previousDate = yesterday.toISOString().split("T")[0];

    const apiKey = "aa318525f6244f449581ebe5a48602f2";
    const url = `https://api.worldnewsapi.com/top-news?source-country=${countryCode}&language=en&date=${previousDate}&max-news-per-cluster=1`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    const data = await response.json();

    if (!data.top_news || data.top_news.length < 3) {
      const newUrl =
        `https://api.worldnewsapi.com/top-news?source-country=us&language=en&date=${previousDate}&max-news-per-cluster=1`;

      const response = await fetch(newUrl, {
        headers: {
          "x-api-key": apiKey,
        },
      });

      const newData = await response.json();
      return [newData.top_news[0], newData.top_news[1], newData.top_news[2]];
    }

    const news = [data.top_news[0], data.top_news[1], data.top_news[2]];

    return news;
  } catch (error) {
    console.error("Error fetching news data:", error);
  }
}

async function fetchMovies() {
  const apiKey =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MzAyZDgyN2I1YjgzYzk5OWEwMTljZTAwMzAwZTcwYyIsIm5iZiI6MTc3MDQ4NjAzNC45MDEsInN1YiI6IjY5ODc3OTEyNWZiZDBkMDcwYjVkODZjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fx7CzrSmmg1k0_WZXmhd_f9vo5KWDNV2HGE_QsU7KpE";
  const url =
    "https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&vote_count.gte=500&page=1";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const data = await response.json();
  const randomNum = Math.floor(Math.random() * 21);

  const movie = data.results[randomNum];

  return movie;
}

async function updateRandomPerson() {
  const profileImg = document.getElementById("profile-image");
  const profileFirstName = document.getElementById("profile-first-name");
  const profileFullName = document.getElementById("profile-full-name");
  const profileGender = document.getElementById("profile-gender");
  const profileAge = document.getElementById("profile-age");
  const profileLocation = document.getElementById("profile-location");
  const profileIntro = document.getElementById("profile-intro");

  const randomPerson = await fetchRandomPerson();

  profileImg.src = randomPerson.picture.large;
  profileFirstName.textContent = randomPerson.name.first;
  profileFullName.textContent = `${randomPerson.name.first} ${randomPerson.name.last}`;
  profileGender.textContent = randomPerson.gender;
  profileAge.textContent = randomPerson.dob.age;
  profileLocation.textContent = `${randomPerson.location.city}, ${randomPerson.location.state}, ${randomPerson.location.country}`;

  profileIntro.textContent = `
Hi, I’m ${randomPerson.name.first}, a ${randomPerson.dob.age}-year-old 
from ${randomPerson.location.country}, currently living in 
${randomPerson.location.city}, ${randomPerson.location.state}.

I enjoy staying informed and exploring new cultures and ideas wherever I find myself.

Right now, I’m checking the current weather in ${randomPerson.location.city} to see what today feels like, whether it’s a sunny day perfect for a walk or a cold, cloudy one best spent indoors.

To stay connected beyond my city, I keep up with the latest news from 
${randomPerson.location.country}, giving me a quick snapshot of what’s happening around me.

When it’s time to unwind, I turn to movies. My favorite picks usually reflect the kinds of stories I enjoy watching.

This dashboard brings my world together, who I am, where I live, what’s happening around me, 
and what I love to watch.
`;

  return [randomPerson.location.city, randomPerson.nat.toLowerCase()];
}

let getWeatherDay = (localDate) => {
  let date = new Date(localDate);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

function updateWeather(weatherData) {
  const weatherLocation = document.getElementById("weather-location");
  const weatherTemp = document.getElementById("weather-temperature");
  const weatherDay = document.getElementById("weather-day");
  const weatherCondition = document.getElementById("weather-condition");
  const weatherIcon = document.getElementById("weather-icon");
  const weatherWind = document.getElementById("weather-wind");
  const weatherHumidity = document.getElementById("weather-humidity");
  const weatherPercipitation = document.getElementById("weather-percipitation");

  weatherLocation.textContent = weatherData.location.name;
  weatherTemp.textContent = weatherData.current.temp_c;

  let localDate = weatherData.location.localtime.split(" ")[0];

  weatherDay.textContent = getWeatherDay(localDate);

  weatherCondition.textContent = weatherData.current.condition.text;
  weatherIcon.src = weatherData.current.condition.icon;
  weatherWind.textContent = weatherData.current.wind_kph;
  weatherHumidity.textContent = weatherData.current.humidity;
  weatherPercipitation.textContent = weatherData.current.precip_mm;
}

function updateNews(newsData, listNo) {
  const newsDate = document.getElementById(`news-date-${listNo}`);
  const newsTitle = document.getElementById(`news-title-${listNo}`);
  const newsAuthor = document.getElementById(`news-author-${listNo}`);
  const newsUrl = document.getElementById(`news-url-${listNo}`);
  const newsImage = document.getElementById(`news-image-${listNo}`);

  const article = newsData.news[0];

  const publishDate = new Date(article.publish_date);

  newsDate.textContent = publishDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  newsTitle.textContent = article.title;
  newsAuthor.textContent = article.author;
  newsUrl.href = article.url;
  newsImage.src = article.image;
}

function updateMovie(movieData) {
  const moviePoster = document.getElementById("movie-poster");
  const movieTitle = document.getElementById("movie-title");
  const movieRating = document.getElementById("movie-rating");
  const movieReleaseYear = document.getElementById("movie-release-year");
  const movieOverview = document.getElementById("movie-overview");

  moviePoster.src = `https://image.tmdb.org/t/p/w154${movieData.poster_path}`;
  moviePoster.alt = movieData.title;
  movieTitle.textContent = movieData.title;
  movieRating.textContent = movieData.vote_average.toFixed(1);
  movieReleaseYear.textContent = new Date(movieData.release_date).getFullYear();
  movieOverview.textContent = movieData.overview;
}

async function loadDashBoard() {
  let city;
  let countryCode;

  try {
    const randomePersonData = await updateRandomPerson();
    city = randomePersonData[0];
    countryCode = randomePersonData[1];
  } catch (error) {
    console.error("Error updating random person:", error);
  }

  try {
    const weatherData = await fetchWeather(city);
    updateWeather(weatherData);
  } catch (error) {
    console.error("Error updating weather data:", error);
  }

  try {
    const newsData = await fetchNews(countryCode);
    console.log(newsData);
    for (let i = 0; i < newsData.length; i++) {
      updateNews(newsData[i], i + 1);
    }
  } catch (error) {
    console.error("Error updating news data:", error);
  }

  try {
    const movieData = await fetchMovies();
    updateMovie(movieData);
  } catch (error) {
    console.error("Error updating movie data:", error);
  }
}

loadDashBoard();

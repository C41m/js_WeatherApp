const apiKey = "6ff2f0352eab561384d8f3df45cf4efb";

const apiUrl =
  "http://api.openweathermap.org/data/2.5/weather?units=metric&lang=pt_br&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const conditionApi = document.querySelector(".condition");
const weatherMap = {
  Clouds: "./assets/img/clouds.png",
  Clear: "./assets/img/clear.png",
  Rain: "./assets/img/rain.png",
  Drizzle: "./assets/img/drizzle.png",
  Mist: "./assets/img/mist.png",
  Thunderstorm: "./assets/img/storm.png",
  Snow: "./assets/img/snow.png",
};

const weatherTranslation = {
  Clouds: "Nublado",
  Clear: "Céu Limpo",
  Rain: "Chuva",
  Drizzle: "Chuvisco",
  Mist: "Neblina",
  Thunderstorm: "Tempestade",
  Snow: "Neve",
};

function convertTimestampTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return time;
}

async function getSuggestions() {
  const input = document.querySelector("#cityInput");
  const suggestionBox = document.querySelector(".suggestionBox");
  const suggestionsList = document.getElementById("suggestions");

  suggestionsList.innerHTML = "";

  if (input.value.trim() !== "") {
    const apiUrl = `https://api.geonames.org/searchJSON?q=${input.value}&maxRows=5&username=c41m`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.geonames && Array.isArray(data.geonames)) {
      data.geonames.forEach((city) => {
        if (city.fcodeName !== "continent") {
          const listItem = document.createElement("li");
          listItem.textContent = `${city.name}, ${city.adminName1}, ${city.countryName}`;
          suggestionsList.appendChild(listItem);
        }
      });
      suggestionBox.style.display = "block";
    }
  }
}

function fillInput(event) {
  const input = document.getElementById("cityInput");
  if (event.target.tagName === "LI") {
    input.value = event.target.textContent;
  }
}

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    document.querySelector(".weather").style.display = "block";

    var data = await response.json();
  }

  weatherTxt = data.weather[0].main;
  console.log(data);

  const sunriseTimestamp = data.sys.sunrise;
  const sunsetTimestamp = data.sys.sunset;

  const timeSunrise = convertTimestampTime(sunriseTimestamp);
  const timeSunset = convertTimestampTime(sunsetTimestamp);

  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "ºc";
  document.querySelector(".humidity").innerHTML = data.main.humidity + " %";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
  document.querySelector(".mintemp").innerHTML = data.main.temp_min + "ºc";
  document.querySelector(".maxtemp").innerHTML = data.main.temp_max + "ºc";
  document.querySelector(".feels").innerHTML = data.main.feels_like + "ºc";
  document.querySelector(".sunrise").innerHTML = timeSunrise + "H";
  document.querySelector(".sunset").innerHTML = timeSunset + "H";

  if (weatherMap.hasOwnProperty(weatherTxt)) {
    weatherIcon.src = weatherMap[weatherTxt];
    conditionApi.innerHTML = weatherTranslation[weatherTxt];
  } else {
    console.error(`Tipo de clima não encontrado: ${weatherTxt}`);
  }

  document.querySelector(".weather").classList.add("active");
  document.querySelector(".error").style.display = "none";
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
  const suggestionBox = document.querySelector(".suggestionBox");
  suggestionBox.style.display = "none";
});

searchBox.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    checkWeather(searchBox.value);
    const suggestionBox = document.querySelector(".suggestionBox");
    suggestionBox.style.display = "none";
    suggestionBox.style.height = "1px";
  }
});

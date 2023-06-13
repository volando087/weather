const date = new Date().toLocaleString("ru", {
    month:    'numeric',
    day:      'numeric',
    timezone: 'UTC'
  });
let hours = (new Date()).getHours();
let minutes = (new Date()).getMinutes(); // нужно добавить if, проверяющий если там только одно значение, и добавляющий в строку "0", чтобы было 00, а не просто 0
let pdate = document.getElementById("datetime"); // date в элементе p
pdate.textContent = "Погода на " + date + ', ' + hours +':' + minutes +'.';

function Weather(mainWeather, description, temperature, tempFeels, pressure, humidity, wind, windDegrees, sunrise, sunset) {
  this.mainWeather = mainWeather;
  this.description = description;
  this.temperature = temperature;
  this.tempFeels   = tempFeels;
  this.pressure    = pressure;
  this.humidity    = humidity;
  this.wind        = wind;
  this.windDegrees = windDegrees;
  this.sunrise     = sunrise;
  this.sunset      = sunset;
}

//JSON
let k = 0; //переменная для состояния, чтобы определять какие данные выдавать на табло
let lat = 55.55; //данные МСК
let lon = 37.36;
let nowWeatherRequestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat.toString() + "&lon=" + lon.toString() + "&appid=e17ace3787c0d7fbaacbc0db1bd822f7&units=metric&lang=ru" //готовый url с коорд МСК и погодой сейчас
                 // ^ готовый url с погодой сейчас

let laterWeatherRequestUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + lat.toString() + "&longitude=" + lon.toString() + "&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant&timeformat=unixtime&timezone=Europe%2FMoscow";

let mainWeather; // переменная для основной погоды
let description; // переменная для краткого описания погоды
let temperature; // переменная для температуры
let tempFeels;   // переменная для температуры по ощущениям
let pressure;    // переменная для давления в hPa, для мм рт ст нужно умножить на 0.75
let humidity;    // переменная для влажности в %;
let wind;        // переменная для ветра
let windDegrees; // переменная для указания направления ветра
let sunrise;     // переменная для восхода
let sunset;      // переменная для заката

let now   = new Weather(mainWeather, description, temperature, tempFeels, pressure, humidity, wind, windDegrees, sunrise, sunset); //объект со значениями погоды сейчас
let later = new Weather(mainWeather, description, temperature, tempFeels, pressure, humidity, wind, windDegrees, sunrise, sunset); //объект со значениями погоды позже
let clear = new Weather(mainWeather, description, temperature, tempFeels, pressure, humidity, wind, windDegrees, sunrise, sunset);
let weatherObj = {      // сохранил данные для погоды сейчас, appid это айди который получил из кабинета https://openweathermap.org/
  "appid": "e17ace3787c0d7fbaacbc0db1bd822f7",
  "units": "metric",
  "lang" : "ru",
}

let nowWeatherString;                                                   // строка, возвращаемая от запроса, равная реквесту
let nowWeatherRequest = new XMLHttpRequest();                           // запрос с погодой сейчас

let laterWeatherString;                                                 // строка, возвращаемая от запроса, равная реквесту 
let laterWeatherRequest = new XMLHttpRequest();                         // запрос с погодой сейчас

let temperatureContent = document.getElementById('temperatureContent');        // элемент, отвечающий за показ температуры
let humidityContent    = document.getElementById('humidityContent');           // элемент, отвечающий за показ влажности
let tempFeelsContent   = document.getElementById('tempFeelsContent');          // элемент, отвечающий за показ ощущаемой температуры
let windContent        = document.getElementById('windContent');               // элемент, отвечающий за показ скорости ветра
let pressureContent    = document.getElementById('pressureContent');           // элемент, отвечающий за показ давления
let windDegreesContent = document.getElementById('windDegreesContent');        // элемент, отвечающий за показ направления ветра
let sunriseContent     = document.getElementById('sunriseContent');            // элемент, отвечающий за показ всохода
let sunsetContent      = document.getElementById('sunsetContent');             // элемент, отвечающий за показ захода

laterWeatherRequest.open('GET', laterWeatherRequestUrl);
laterWeatherRequest.responseType = 'json';
laterWeatherRequest.send();

// nowWeatherRequest.open('GET', laterWeatherRequestUrl);
// nowWeatherRequest.responseType = 'json';
// nowWeatherRequest.send();

// nowWeatherRequest.onload = function() { 
//   nowWeatherString = nowWeatherRequest.response;
//   now.mainWeather  = nowWeatherString.weather[0].main;
//   now.description  = nowWeatherString.weather[0].description;
//   now.temperature  = nowWeatherString.main.temp;
//   now.tempFeels    = nowWeatherString.main.feels_like;
//   now.pressure     = nowWeatherString.main.pressure;
//   now.humidity     = nowWeatherString.main.humidity;
//   now.wind         = nowWeatherString.wind.speed;
//   now.windDegrees  = nowWeatherString.wind.deg;
//   now.sunrise      = nowWeatherString.sys.sunrise;
//   now.sunset       = nowWeatherString.sys.sunset;
// }


laterWeatherRequest.onload = function() { 
  laterWeatherString = laterWeatherRequest.response;
  later.mainWeather  = 0;
  later.description  = 0;
  later.temperature  = laterWeatherString.daily.temperature_2m_max;
  later.tempFeels    = laterWeatherString.daily.apparent_temperature_max;
  later.pressure     = laterWeatherString.daily.rain_sum;                   // 
  later.humidity     = laterWeatherString.daily.precipitation_sum;          // сумма осадков мм, поменять нужно в выдаче
  later.wind         = laterWeatherString.daily.windspeed_10m_max;
  later.windDegrees  = laterWeatherString.daily.winddirection_10m_dominant;
  later.sunrise      = laterWeatherString.daily.sunrise;
  later.sunset       = laterWeatherString.daily.sunset;
}

  clear.mainWeather  = "";       //объект clear для очистки поля, функция refreshInfo() берет его и ставит пустые строки вместо данных
  clear.description  = "";
  clear.temperature  = "";        
  clear.tempFeels    = "";            
  clear.pressure     = "";            
  clear.humidity     = ""             
  clear.wind         = "";            
  clear.windDegrees  = "";          
  clear.sunrise      = "";               
  clear.sunset       = "";                



function clearInfo() {
  temperatureContent.textContent = 'Температура воздуха: C°';
  humidityContent.textContent    = 'Влажность: %';
  tempFeelsContent.textContent   = 'Ощущаемая температура воздуха: C°';
  windContent.textContent        = 'Скорость ветра м/с:';
  pressureContent.textContent    = 'Давление: мм. рт. ст.';
  windDegreesContent.textContent = 'Направление ветра: ';
  sunriseContent.textContent     = 'Восход: ';
  sunsetContent.textContent      = 'Закат: ';
  pdate.textContent              = 'Погода на ' + date + ', ' + (new Date()).getHours(); +':' + (new Date()).getMinutes();
}


function refreshInfo() {   //обновляет информацию на табло, принимает объект со значениями
  if (k == 0) {
    temperatureContent.textContent = 'Температура воздуха: ' + now.temperature + ' C°';
    humidityContent.textContent    = 'Влажность: ' + now.humidity + ' %';
    tempFeelsContent.textContent   = 'Ощущаемая температура воздуха: ' + now.tempFeels + ' C°';
    windContent.textContent        = 'Скорость ветра ' + now.wind + ' м/с:';
    pressureContent.textContent    = 'Давление: ' + now.pressure*0.75 + ' мм. рт. ст.';
    windDegreesContent.textContent = 'Направление ветра: ' + now.windDegrees;
    sunriseContent.textContent     = 'Восход: ' + (new Date(now.sunrise*1000)).getHours() + ':' + (new Date(now.sunrise*1000)).getMinutes();
    sunsetContent.textContent      = 'Закат: ' + (new Date(now.sunset*1000)).getHours() + ':' + (new Date(now.sunset*1000)).getMinutes();
    pdate.textContent              = 'Погода на ' + date + ', ' + (new Date()).getHours(); +':' + (new Date()).getMinutes() + ": " + now.description +'.';
  } else if (k == 1) {
    temperatureContent.textContent = 'Температура воздуха: ' + later.temperature[k] + ' C°';
    humidityContent.textContent    = 'Влажность: ' + later.humidity[k] + ' %';
    tempFeelsContent.textContent   = 'Ощущаемая температура воздуха: ' + later.tempFeels[k] + ' C°';
    windContent.textContent        = 'Скорость ветра ' + later.wind[k] + ' м/с:';
    pressureContent.textContent    = 'Сумма осадков: ' + later.pressure[k]*0.75 + ' мм';
    windDegreesContent.textContent = 'Направление ветра: ' + later.windDegrees[k] + ' градусов.';
    sunriseContent.textContent     = 'Восход: ' + (new Date(later.sunrise[k]*1000)).getHours() + ':' + (new Date(later.sunrise[k]*1000)).getMinutes();
    sunsetContent.textContent      = 'Закат: ' + (new Date(later.sunset[k]*1000)).getHours() + ':' + (new Date(later.sunset[k]*1000)).getMinutes();
    pdate.textContent              = 'Погода на ' + date + ', ' + (new Date()).getHours(); +':' + (new Date()).getMinutes() + ": " + later.description +'.';
  } else if (k == 2) {
    temperatureContent.textContent = 'Температура воздуха: ' + later.temperature[k] + ' C°';
    humidityContent.textContent    = 'Влажность: ' + later.humidity[k] + ' %';
    tempFeelsContent.textContent   = 'Ощущаемая температура воздуха: ' + later.tempFeels[k] + ' C°';
    windContent.textContent        = 'Скорость ветра ' + later.wind[k] + ' м/с:';
    pressureContent.textContent    = 'Сумма осадков: ' + later.pressure[k]*0.75 + ' мм';
    windDegreesContent.textContent = 'Направление ветра: ' + later.windDegrees[k] + ' градусов.';
    sunriseContent.textContent     = 'Восход: ' + (new Date(later.sunrise[k]*1000)).getHours() + ':' + (new Date(later.sunrise[k]*1000)).getMinutes();
    sunsetContent.textContent      = 'Закат: ' + (new Date(later.sunset[k]*1000)).getHours() + ':' + (new Date(later.sunset[k]*1000)).getMinutes();
    pdate.textContent              = 'Погода на ' + date + ', ' + (new Date()).getHours(); +':' + (new Date()).getMinutes() + ": " + later.description +'.';
  } else if (k == 4) {
    temperatureContent.textContent = 'Температура воздуха: ' + later.temperature[k] + ' C°';
    humidityContent.textContent    = 'Влажность: ' + later.humidity[k] + ' %';
    tempFeelsContent.textContent   = 'Ощущаемая температура воздуха: ' + later.tempFeels[k] + ' C°';
    windContent.textContent        = 'Скорость ветра ' + later.wind[k] + ' м/с:';
    pressureContent.textContent    = 'Сумма осадков: ' + later.pressure[k]*0.75 + ' мм';
    windDegreesContent.textContent = 'Направление ветра: ' + later.windDegrees[k] + ' градусов.';
    sunriseContent.textContent     = 'Восход: ' + (new Date(later.sunrise[k]*1000)).getHours() + ':' + (new Date(later.sunrise[k]*1000)).getMinutes();
    sunsetContent.textContent      = 'Закат: ' + (new Date(later.sunset[k]*1000)).getHours() + ':' + (new Date(later.sunset[k]*1000)).getMinutes();
    pdate.textContent              = 'Погода на ' + date + ', ' + (new Date()).getHours(); +':' + (new Date()).getMinutes() + ": " + later.description +'.';
  }
}

const getInfo         = document.getElementById('getInfo');
const nowButton       = document.getElementById('nowButton');
const tomorrowButton  = document.getElementById('tomorrowButton');
const threeDaysButton = document.getElementById('threeDaysButton');
const fiveDaysButton  = document.getElementById('fiveDaysButton');

getInfo.addEventListener('click', () => refreshInfo());

nowButton.addEventListener('click',       () => clearInfo());   //эти 4 функции очищают табло при нажатии на кнопку сегодня/завтра/3дня/5дней
tomorrowButton.addEventListener('click',  () => clearInfo());
threeDaysButton.addEventListener('click', () => clearInfo());
fiveDaysButton.addEventListener('click',  () => clearInfo());

nowButton.addEventListener('click',       () => {k = 0;});             //эти 4 функции устанавливают состояние для определения какие данные выдавать пользователю
tomorrowButton.addEventListener('click',  () => {k = 1;});
threeDaysButton.addEventListener('click', () => {k = 2;});
fiveDaysButton.addEventListener('click',  () => {k = 4;});
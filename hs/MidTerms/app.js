import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
const baseURL = "http://api.openweathermap.org/data/2.5/weather";

const router = new Router();

router
  .get('/', home)
  .get('/weather', getWeather);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

async function home(ctx) {
  ctx.response.body = "Welcome to the Weather App!";
}

async function getWeather(ctx) {
  const { searchParams } = ctx.request.url;
  const city = searchParams.get("city");
  
  if (!city) {
    ctx.response.body = "Please provide a city parameter.";
    return;
  }

  const url = `${baseURL}?q=${city}&appid=${API_KEY}`;
  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    const weatherDescription = data.weather[0].description;
    const temperature = (data.main.temp - 273.15).toFixed(2); // Convert temperature to Celsius

    ctx.response.body = `Weather in ${city}: ${weatherDescription}, Temperature: ${temperature}°C`;
  } else {
    ctx.response.body = "Unable to fetch weather data. Please try again later.";
  }
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });

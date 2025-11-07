// weather.js - ahora exporta una función reutilizable `fetchWeather`
// Esta versión está pensada para ejecutarse en el navegador (ES module).

export async function fetchWeather(city, apiUrl, apiKey) {
  if (!city || !city.trim()) {
    alert("Por favor ingresa una ciudad antes de buscar.");
    return;
  }

  const errorEl = document.querySelector(".error");
  const weatherEl = document.querySelector(".weather");
  const cityEl = document.querySelector(".city");
  const tempEl = document.querySelector(".temp");
  const humidityEl = document.querySelector(".humidity");
  const windEl = document.querySelector(".wind");
  const iconEl = document.querySelector(".weather .icon");
  const tarjetaEl = document.querySelector(".tarjeta");

  // Mostrar carga/ocultar resultado mientras se consulta
  if (errorEl) errorEl.style.display = "none";
  if (weatherEl) weatherEl.style.display = "none";

  try {
    const resp = await fetch(
      `${apiUrl}&q=${encodeURIComponent(city)}&appid=${apiKey}`
    );

    if (!resp.ok) {
      // 404 o cualquier otro error
      if (errorEl) {
        errorEl.textContent = "No existe la ciudad o error en la búsqueda.";
        errorEl.style.display = "block";
      }
      return;
    }

    const data = await resp.json();

    if (cityEl) cityEl.textContent = data.name || "-";
    if (tempEl) tempEl.textContent = Math.round(data.main.temp) + "°C";
    if (humidityEl) humidityEl.textContent = data.main.humidity + "%";
    // Convertir m/s a km/h
    if (windEl)
      windEl.textContent = Math.round((data.wind.speed || 0) * 3.6) + " km/h";

    // Elegir ícono según estado
    const main =
      data.weather && data.weather[0] && data.weather[0].main
        ? data.weather[0].main
        : "";
    if (iconEl) {
      if (main === "Clouds") {
        iconEl.src = "weather/Imagenes-del-clima/clouds.png";
      } else if (main === "Clear") {
        iconEl.src = "weather/Imagenes-del-clima/clear.png";
      } else if (main === "Rain") {
        iconEl.src = "weather/Imagenes-del-clima/rain.png";
      } else if (main === "Drizzle") {
        iconEl.src = "weather/Imagenes-del-clima/drizzle.png";
      } else if (main === "Mist") {
        iconEl.src = "weather/Imagenes-del-clima/mist.png";
      } else {
        // icono por defecto
        iconEl.src = "weather/Imagenes-del-clima/clouds.png";
      }
    }

    // === Cambiar fondo de la página según el clima (y opcionalmente por ciudad) ===
    // Mapeo simple a imágenes locales dentro del proyecto.
    const weatherBackgrounds = {
      Clear: "weather/Imagenes-del-clima/soleado.gif",
      Clouds: "rain-6812_256.gif",
      Rain: "rain-6812_256.gif",
      Drizzle: "rain-6812_256.gif",
      Mist: "weather/Imagenes-del-clima/fondo1.png",
      Snow: "weather/Imagenes-del-clima/fondo1.png",
      default: "rain-6812_256.gif",
    };

    const selectedBg = weatherBackgrounds[main] || weatherBackgrounds.default;
    // Aplicar el fondo al body
    try {
      document.body.style.backgroundImage = `url("${selectedBg}")`;
      // Mantener mismas propiedades definidas en CSS
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    } catch (err) {
      console.warn("No se pudo aplicar el fondo dinámico:", err);
    }

    // Si quisieras imágenes por ciudad (mejor calidad): integrar Unsplash API
    // y buscar una foto por `city` y `main`. Requiere UNSPLASH_ACCESS_KEY.
    // Ejemplo (opcional):
    // const UNSPLASH_KEY = window.UNSPLASH_KEY;
    // if (UNSPLASH_KEY) { fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(city + ' ' + main)}&client_id=${UNSPLASH_KEY}`)... }

    // Mostrar la sección de weather
    if (weatherEl) weatherEl.style.display = "block";
    if (tarjetaEl) tarjetaEl.style.height = "auto";
    // pequeños ajustes de espaciado
    const busquedaEl = document.querySelector(".busqueda");
    const detailsEl = document.querySelector(".details");
    if (busquedaEl) busquedaEl.style.marginTop = "30px";
    if (detailsEl) detailsEl.style.marginTop = "30px";
    if (errorEl) errorEl.style.display = "none";
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = "Error de red. Intenta de nuevo.";
      errorEl.style.display = "block";
    }
    console.error("fetchWeather error:", err);
  }
}

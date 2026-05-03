class WeatherService {
    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.baseURL = 'https://api.openweathermap.org/data/2.5/weather';
    }

    async getWeather(lat, lon) {
        if (!lat || !lon) return null;

        try {
            console.log(`☁️ Consultando OpenWeather para: ${lat}, ${lon}`);
            
            const url = `${this.baseURL}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=es`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                console.error("🚨 Error de OpenWeather:", data.message);
                return null;
            }

            return {
                temperatura: Math.round(data.main.temp) + "°C",
                sensacion: Math.round(data.main.feels_like) + "°C",
                descripcion: data.weather[0].description,
                humedad: data.main.humidity + "%",
                viento: data.wind.speed + " m/s",
                icono: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            };
        } catch (error) {
            console.error("💥 Fallo en WeatherService:", error.message);
            return null;
        }
    }
}

export default new WeatherService();
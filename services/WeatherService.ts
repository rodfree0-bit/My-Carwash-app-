
// Mock weather service - structured to easily swap with OpenWeatherMap later
export interface WeatherData {
    temp: number;
    condition: string; // 'Sunny', 'Cloudy', 'Rain', 'Partly Cloudy'
    description: string; // Spanish description
    icon: string; // Material symbol name
    humidity: number;
    windSpeed: number;
}

export const WeatherService = {
    getCurrentWeather: async (lat: number, lng: number): Promise<WeatherData> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get current hour to simulate day/night changes somewhat realistically
        const hour = new Date().getHours();
        const isNight = hour < 6 || hour > 19;

        // Realistic mock data logic based on time
        // Default to "Partly Cloudy" / "Mayormente Soleado" generic nice weather
        let weather: WeatherData = {
            temp: 24,
            condition: 'Partly Cloudy',
            description: 'Partly Cloudy',
            icon: isNight ? 'nights_stay' : 'partly_cloudy_day',
            humidity: 45,
            windSpeed: 12
        };

        // Simple randomization for variety (simulating real fetch)
        const random = Math.random();

        if (random > 0.8) {
            weather = {
                temp: 28,
                condition: 'Sunny',
                description: 'Sunny',
                icon: isNight ? 'clear_night' : 'wb_sunny',
                humidity: 30,
                windSpeed: 10
            };
        } else if (random > 0.6) {
            weather = {
                temp: 19,
                condition: 'Cloudy',
                description: 'Cloudy',
                icon: 'cloud',
                humidity: 60,
                windSpeed: 15
            };
        } else if (random < 0.1) {
            weather = {
                temp: 18,
                condition: 'Rain',
                description: 'Light Rain',
                icon: 'rainy',
                humidity: 80,
                windSpeed: 18
            };
        }

        return weather;
    }
};

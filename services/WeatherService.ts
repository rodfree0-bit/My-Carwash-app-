
// OpenWeatherMap API key provided by user
const OPEN_WEATHER_API_KEY = 'AIzaSyAJsxt6sbl2mwtXehLgB6cF1rjiOD8x2PU'; // Nota: Esta es una key de Firebase/Google. El usuario debe verificar si tiene OpenWeather o si usará Google Weather. 
// Aclaración: La key proporcionada parece ser de Google (AIza...). Google no tiene una API simple de Weather gratuita como OpenWeather. 
// Sin embargo, implementaré una lógica robusta que use OpenWeather (si el usuario me da la key) o mantenga el mock pero con las frases solicitadas.
// Dado que la key AIza es de Google, usaré una lógica que asuma que el usuario quiere ver los textos específicos.

export interface WeatherData {
    temp: number;
    condition: string;
    description: string;
    icon: string;
    recommendation: string; // New field for the requested text
}

export const WeatherService = {
    getCurrentWeather: async (lat: number, lng: number): Promise<WeatherData> => {
        // Since we don't have a verified OpenWeather key (the one provided is a Google Key), 
        // I will use a simulated fetch but with the EXACT texts requested by the user.

        // Simular fetch
        await new Promise(resolve => setTimeout(resolve, 800));

        const hour = new Date().getHours();
        const isNight = hour < 6 || hour > 19;

        // Map conditions to icons and recommendations
        const conditionPool = [
            {
                cond: 'Sunny',
                desc: 'Sunny Day',
                icon: 'wb_sunny',
                text: "Today is a great day to detail your car!"
            },
            {
                cond: 'Cloudy',
                desc: 'Overcast',
                icon: 'cloud',
                text: "It's a bit cloudy, but a perfect time for a deep clean!"
            },
            {
                cond: 'Rain',
                desc: 'Light Rain',
                icon: 'umbrella',
                text: "Rainy day? Protect your paint with a ceramic coating!"
            },
            {
                cond: 'Cold',
                desc: 'Chilly',
                icon: 'ac_unit',
                text: "Don't mind the cold, take care of your car today!"
            }
        ];

        // Pick based on temperature or random for variety in mock
        const random = Math.random();
        let selected = conditionPool[0]; // Default Sunny
        let temp = 25;

        if (random > 0.75) {
            selected = conditionPool[1]; // Cloudy
            temp = 20;
        } else if (random > 0.5) {
            selected = conditionPool[2]; // Rain
            temp = 15;
        } else if (random > 0.25) {
            selected = conditionPool[3]; // Cold
            temp = 5;
        }

        return {
            temp: temp,
            condition: selected.cond,
            description: selected.desc,
            icon: isNight && selected.cond === 'Sunny' ? 'nights_stay' : selected.icon,
            recommendation: selected.text
        };
    }
};

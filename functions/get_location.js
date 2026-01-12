
const { SquareClient } = require('square');

const client = new SquareClient({
    bearerAuthCredentials: {
        accessToken: 'EAAAl75lQlXnL4xAeNapnpU2_TZp54ILQSTuZ8aNdqttceFfRG0jMCz4Xyd28YTz', // Sandbox Access Token
    },
    environment: 'sandbox',
});

async function getLocations() {
    try {
        const response = await client.locationsApi.listLocations();
        console.log('Locations found:', response.result.locations.length);
        response.result.locations.forEach(location => {
            console.log(`---`);
            console.log(`Name: ${location.name}`);
            console.log(`ID: ${location.id}`);
            console.log(`Status: ${location.status}`);
        });
    } catch (error) {
        console.error('Error fetching locations:', error);
    }
}

getLocations();

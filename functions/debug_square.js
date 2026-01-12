
const square = require('square');
console.log('SquareClient type:', typeof square.SquareClient);

try {
    const client = new square.SquareClient({
        bearerAuthCredentials: {
            accessToken: 'EAAAl75lQlXnL4xAeNapnpU2_TZp54ILQSTuZ8aNdqttceFfRG0jMCz4Xyd28YTz', // Sandbox Access Token
        },
        environment: 'sandbox',
    });
    console.log('Client created successfully');

    // Try to list locations
    client.locationsApi.listLocations().then(response => {
        console.log('Locations found:', response.result.locations.length);
        console.log('First Location ID:', response.result.locations[0].id);
    }).catch(e => {
        console.error('API Call failed:', e);
    });

} catch (e) {
    console.error('Instantiation failed:', e);
}

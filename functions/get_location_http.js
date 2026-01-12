
const axios = require('axios');

const ACCESS_TOKEN = 'EAAAl75lQlXnL4xAeNapnpU2_TZp54ILQSTuZ8aNdqttceFfRG0jMCz4Xyd28YTz';

async function getLocations() {
    try {
        const response = await axios.get('https://connect.squareupsandbox.com/v2/locations', {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Locations found:', response.data.locations.length);
        response.data.locations.forEach(location => {
            console.log(`---`);
            console.log(`Name: ${location.name}`);
            console.log(`ID: ${location.id}`);
            console.log(`Status: ${location.status}`);
        });
    } catch (error) {
        console.error('Error fetching locations:', error.response ? error.response.data : error.message);
    }
}

getLocations();

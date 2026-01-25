const functions = require('firebase-functions');
console.log('Type of functions:', typeof functions);
console.log('Type of functions.region:', typeof functions.region);
console.log('Keys of functions:', Object.keys(functions));

try {
    const v1 = require('firebase-functions/v1');
    console.log('Type of v1.region:', typeof v1.region);
} catch (e) {
    console.log('Could not require firebase-functions/v1');
}

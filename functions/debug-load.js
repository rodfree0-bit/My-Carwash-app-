try {
    console.log("Attempting to require index.js...");
    require('./index.js');
    console.log("Successfully required index.js");
} catch (error) {
    console.error("Error loading index.js:");
    console.error(error);
}

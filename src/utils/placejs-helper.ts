export const initPlaceJS = (selector: string, onchange: (e: any) => void, onclear: () => void) => {
    const places = require("places.js");
    const placesAutocomplete = places({
        appId: "plN8CZBA98O2",
        apiKey: "251731162a7ccdb036d8851c75a3dec9",
        container: document.querySelector(selector)
    }).configure({
        countries: ["tw"]
    });

    placesAutocomplete.on("change", onchange);

    placesAutocomplete.on("clear", onclear);
}
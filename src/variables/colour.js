const { array } = require("../middleware/multerFiles");

function generateColour() { 
    return "hsl(" + 360 * Math.random() + ',' +
               (25 + 100 * Math.random()) + '%,' + 
               (20 + 30 * Math.random()) + '%)'
}

// https://coolors.co/d50000-f6bf26-0b8043-33b679-039be5-3f51b5-7986cb-8e24aa-e67c73-616161
function arrayColour() {
    const colours = [
        "hsl(0, 100%, 42%)", // Rosso Corsa
        "hsl(149, 84%, 27%)", // Sea Green
        "hsl(152, 56%, 46%)", // Medium Sea Green 
        "hsl(200, 97%, 45%)", // Carolina Blue 
        "hsl(231, 48%, 48%)", // Violet Purple 
        "hsl(230, 44%, 64%)", // Glaucous
        "hsl(287, 65%, 40%)", // Purple Munsell 
        "hsl(5, 70%, 68%)", // Light Coral 
        "hsl(0, 0%, 38%)", // Dim Grey 
    ];

    return colours[Math.floor(Math.random() * colours.length)];
}

module.exports = {
    generateColour: generateColour,
    arrayColour: arrayColour
}
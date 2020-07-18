function generateColour() { 
    return "hsl(" + 360 * Math.random() + ',' +
               (25 + 100 * Math.random()) + '%,' + 
               (20 + 30 * Math.random()) + '%)'
}

module.exports = generateColour;
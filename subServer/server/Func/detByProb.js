function getRandomValue(min,max){
        return Math.random() * (max - min) + min

}
function detByProb(probability){
        const randomValue = getRandomValue(0,100)
        return randomValue > probability

}

export default detByProb

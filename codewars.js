const object1 = {
    name: "Vlad",
    city: "Minsk",
    country: "Belarus"
}

const object2 = {
    name: "Max",
    city: "Moscow"
}

console.log({...object1, ...object2})
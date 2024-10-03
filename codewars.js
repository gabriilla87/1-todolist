console.log(1)
console.log(2)
let pr = new Promise((res) => {
    console.log(2.1)
    setTimeout(() => {
        res()
    }, 0)
    console.log(2.2)
})
pr.then(() => {
    console.log(4)
})
console.log(3)
console.log(0)

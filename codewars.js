//maxNum
const findMax = (arr = [101, 45, 66, 2, 4, 100, -2, -10, -100, 6]) => {
  let maxNum = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxNum) maxNum = arr[i];
  }
  console.log(maxNum);
};

findMax();

//minNum
const findMin = (arr = [1, 45, 66, 2, 4, 100, -2, -10, -100, 6]) => {
  let minNum = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < minNum) minNum = arr[i];
  }
  console.log(minNum);
};

findMin();

//factorial
const factorial = (n) => {
  return n ? n * factorial(n - 1) : 1;
};

console.log(factorial(5));

//Fibonacci
const fib = (n) => {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
};

console.log(fib(1));

//сумма n чисел
const sumTo = (n) => {
  return n > 1 ? n + sumTo(n - 1) : 1;
};

console.log(sumTo(2));

//bind (не выполняет функцию, возвращает другую функцию с навсегда заданным контекстом):
function foo() {
  console.log(this.name);
}

let a = { name: "Dima" };
let b = { name: "Viktor" };

const bindedFooA = foo.bind(a);
const bindedFooB = foo.bind(b);

bindedFooA(); // 'Dima'
bindedFooB(); // 'Viktor'

// bind* более сложный пример с параметрами:

function foo2(age, city) {
  console.log(`${this.name}, ${age}, ${city}`);
}

let a2 = { name: "Dima" };
let b2 = { name: "Viktor" };

const bindedFoo2A = foo2.bind(a2, 30, "Tbilisi");
const bindedFoo2B = foo2.bind(b2, 18, "Minsk");

bindedFoo2A(); // Dima, 30, Tbilisi
bindedFoo2B(); // 'Viktor, 18, Minsk

//apply\call (сразу выполняют функцию, разница двух функций в том, как передавать параметры...    apply - array, call - comma (запятая))
function foo3(age, city) {
  console.log(`${this.name}, ${age}, ${city}`);
}

let a3 = { name: "Dima" };
let b3 = { name: "Viktor" };

foo3.apply(a3, [31, "Tbilisi"]);
foo3.call(b3, 18, "Minsk");

// Map возвращает НОВЫЙ массив.
// Map нужен, чтобы из массива, в котором содержаться элементы в оригинальном виде, получить массив той же длины,
// который сожержит "новые" элементы, полученные на основе элементов старого массива:

// Filter возвращает НОВЫЙ массив.
// Filter нужен, чтобы получить новый отфильтрованный массив, в котором будет меньше элементов, чем в исходном,
// потому что мы фильтруем исходный, убираем ненужное:

// Reducer пробегается по всему массиву и на выход выдаёт какое-то одно обобщённое значение.
// Это может быть как новый массив, так и простое значение примитив или объект:

//Замыкание
function makeCounter() {
  let currentCount = 1;
  return function () {
    // (**)
    return currentCount++;
  };
}

const counter = makeCounter(); // (*)

// каждый вызов увеличивает счётчик и возвращает результат
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// создать другой счётчик, он будет независим от первого
const counter2 = makeCounter();
console.log(counter2()); // 1

//Наследование, пример на class\extends
class Animal {
  constructor(name) {
    this.name = name;
  }
  walk() {
    console.log("I walk: " + this.name);
  }
  eat() {
    console.log("I can eat");
  }
}

class Rabbit extends Animal {
  walk() {
    super.walk();
    console.log("...and jump!");
  }
}

var rabbit = new Rabbit("Bunny");
rabbit.walk();
rabbit.eat();

//Промисификация, setInterval, setTimeout
doItAfter(2).then((ms) => {
  console.log(`Я зарезолвился через ${ms} секунд(ы)`);
});

function doItAfter(ms) {
  return new Promise((res) => setTimeout(() => res(ms), 1000 * ms));
}

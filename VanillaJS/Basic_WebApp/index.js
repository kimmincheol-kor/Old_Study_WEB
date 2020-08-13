// alert('hi vanilla');

const my_title = document.getElementById("my_title");

function sayHello(username) {
    alert(`Hello ${username}`);
}

// sayHello(my_title.innerText);

// DOM : Document Object Model
// Modifying DOM !!

console.dir(my_title);

my_title.innerText = "Second";

console.dir(document);

document.title = "Tutorial-2-!"

const finding = document.querySelector("#my_title");

console.log(finding);
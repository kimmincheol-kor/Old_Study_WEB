const title = document.querySelector("#my_title");

function handler_Resize() {
    alert('resized!!');
}

function handler_Click() {
    alert('clicked!!');
}

// Not Callback Function : Do Immediately
// window.addEventListener("resize", handler_Resize());

// Callback Function : Do after resize
window.addEventListener("resize", handler_Resize);

title.addEventListener("click", handler_Click);
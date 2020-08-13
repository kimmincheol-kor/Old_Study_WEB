const title = document.querySelector("#my_title");

const CLICKED_CLASS = "clicked";

function handler_Resize() {
    alert('resized!!');
}

function handler_Click() {
    alert('clicked!!');

    // const cur_Class = title.className;
    const has_Class = title.classList.contains(CLICKED_CLASS);
    
    if(has_Class){
        //title.className = CLICKED_CLASS;
        title.classList.remove(CLICKED_CLASS);
    }
    else {
        //title.className = "";
        title.classList.add(CLICKED_CLASS);
    }

    console.log(title);
    
}

// Not Callback Function : Do Immediately
// window.addEventListener("resize", handler_Resize());

// Callback Function : Do after resize
window.addEventListener("resize", handler_Resize);

title.addEventListener("click", handler_Click);
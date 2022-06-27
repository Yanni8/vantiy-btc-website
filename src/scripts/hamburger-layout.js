function toggle() {
    layout = document.getElementById("hamburger-layout")
    topNav = document.getElementById("top-navigator")
    
    if(layout.classList == ""){
        layout.classList.add("activated")
        topNav.classList.add("shown")
        return
    }
    layout.classList.remove("activated")
    topNav.classList.remove("shown")
    
}


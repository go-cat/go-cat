function callfragment() {
    if(window.location.hash) {
        var hash = window.location.hash.substring(1);
        document.getElementById(hash).style.color = "#ffffff";
    } else {

    }
}
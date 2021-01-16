
function playSound(){
    document.getElementById("reveal-bird-button").style.display = "block";
}
function revealBird(){
    document.getElementById("listen").style.display = "none";
    document.getElementById("quiz-answer").style.display = "block";
    document.getElementById("reveal-bird-button").style.display = "none";

    // show 'next' button- unless moving to bird 10 (last bird)
    let page = parseInt(document.getElementById("page").innerHTML, 10);
    if (page == 10) {
        console.log("last bird done- show finish");
        document.getElementById("next-button").style.display = "none";
        document.getElementById("finish-block").style.display = "block";
    }
};
function nextBird(){
    document.getElementById("listen").style.display = "block";
    document.getElementById("quiz-answer").style.display = "none";
    document.getElementById("reveal-bird-button").style.display = "none";
    
    // increment page- up to page 10 (last bird)
    let page = parseInt(document.getElementById("page").innerHTML, 10);
    document.getElementById("page").innerHTML = page+1;
}
function quizGallery(){
    // load quiz gallery page
    window.location.replace("quiz-gallery.html");
}
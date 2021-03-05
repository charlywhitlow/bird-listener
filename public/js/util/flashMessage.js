function flashError(message, feedbackP){
    feedbackP.classList.remove('success');
    feedbackP.classList.add('error');
    feedbackP.classList.add('fade-in');
    feedbackP.innerHTML = message;
    setTimeout(function() {
        feedbackP.classList.remove('transparent');
        feedbackP.classList.remove('fade-in');
    }, 400);
}
function flashSuccess(message, feedbackP){
    feedbackP.classList.remove('error');
    feedbackP.classList.add('success');
    feedbackP.classList.add('fade-in-quick');
    feedbackP.innerHTML = message;
    setTimeout(function() {
        feedbackP.classList.remove('transparent');
        feedbackP.classList.remove('fade-in-quick');
    }, 400);
}
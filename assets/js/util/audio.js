function initAudio(xenoID){
    let audio = document.getElementById(`audio-${xenoID}`);
    let progressBar = document.getElementById(`audio-progress-bar-${xenoID}`);
    let durationDiv = document.getElementById(`audio-durationTime-${xenoID}`);
    let currentTimeDiv = document.getElementById(`audio-currentTime-${xenoID}`);    
    progressBar.max = audio.duration;
    durationDiv.innerHTML = formatTime(Math.floor(audio.duration));
    setInterval(updateProgressValue, 250, audio, progressBar, currentTimeDiv);
}
function updateProgressValue(audio, progressBar, currentTimeDiv) {
    progressBar.value = audio.currentTime;
    currentTimeDiv.innerHTML = formatTime(Math.floor(audio.currentTime));
};
function slideProgressBar(xenoID) {
    let progressBar = document.getElementById(`audio-progress-bar-${xenoID}`);
    let audio = document.getElementById(`audio-${xenoID}`);
    let currentTimeDiv = document.getElementById(`audio-currentTime-${xenoID}`);
    let button = document.getElementById(`button-${xenoID}`);
    audio.currentTime = progressBar.value;
    updateProgressValue(audio, progressBar, currentTimeDiv);
    togglePlay(button, xenoID);
    playAudio(audio, button);
};
function togglePlay(button, xenoID){
    let audioID = `audio-${xenoID}`;
    let audio = document.getElementById(audioID);
    let audioPlayers = document.getElementsByTagName('audio');
    for(let i=0; i<audioPlayers.length; i++){
        if(audioPlayers[i].id == audioID){
            audio.paused ? playAudio(audio, button) : pauseAudio(audio, button);
        }else{
            let xeno = audioPlayers[i].id.split('audio-')[1];
            let btn = document.getElementById(`button-${xeno}`);
            pauseAudio(audioPlayers[i], btn);
        }
    }
}
function playAudio(audio, button){
    audio.play();
    button.classList.remove("fa-play");
    button.classList.add("fa-pause");

}
function pauseAudio(audio, button){
    audio.pause();
    button.classList.remove("fa-pause");
    button.classList.add("fa-play");
}
function formatTime(seconds) {
    let min = Math.floor((seconds / 60));
    let sec = Math.floor(seconds - (min * 60));
    if (sec < 10){ 
        sec  = `0${sec}`;
    };
    return `${min}:${sec}`; // M:SS
};
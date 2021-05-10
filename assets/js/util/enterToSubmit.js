function enterToSubmit(input, event, callback){
    if (event.keyCode === 13) {
        input.blur();
        callback();
    }
}
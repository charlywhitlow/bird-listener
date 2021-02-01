// takes the name of a cookie as a parameter
// returns the value of that cookie if it is found
function getCookie(cookie_name) {
    var name = cookie_name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);

    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// call the token endpoint every ten seconds to check authenticated
setInterval(function() {

    fetch('/api/users/token', {
        method: "POST",
        body: JSON.stringify({
            username: getCookie('username'),
            refreshToken: getCookie('refreshJwt')
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => {
        if (response.status===401){
            console.log('Unauthorized')
            window.location.replace('/login');
        }
        return response.json()
    }) 
    .catch(err => {
        console.log('error:')
        console.log(err)
    });

}, 10000); // 10 seconds

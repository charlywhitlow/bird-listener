function login(){
    // check inputs completed
    const feedbackP = document.getElementById('login-feedback');
    let inputUsername = document.getElementById('username').value.trim();
    let inputPassword = document.getElementById('password').value.trim();
    if (inputUsername !== '' && inputPassword !== '') {
        login({ 
            username: inputUsername.toLowerCase(), 
            password: inputPassword
        });
    }else{
        flashError('Please enter username and password to continue', feedbackP)
    }
    // attempt login
    async function login(data){
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .catch(err => {
            console.log('Request Failed', err);
        });
        // handle response
        let json = await response.json();
        if (response.status === 401){
            flashError(json.message+', please try again', feedbackP);
        }
        if (response.status === 200){
            flashSuccess('Logged in', feedbackP)
            setTimeout(function() {
                location.href='menu'
            }, 400);
        }
    }
}
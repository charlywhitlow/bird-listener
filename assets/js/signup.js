function signup(){
    // check inputs completed
    let feedbackP = document.getElementById('signup-feedback');
    let inputUsername = document.getElementById('username').value.trim();
    let inputEmail = document.getElementById('email').value.trim();
    let inputPassword = document.getElementById('password').value.trim();
    if (inputEmail !== '' && inputPassword !== '' && inputUsername !== ''){
        let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let emailValid = emailRegEx.test(inputEmail.toLowerCase());
        if (!emailValid){
            flashError('Please enter a valid email', feedbackP);            
        }else{
            signup({
                username: inputUsername.toLowerCase(), 
                password: inputPassword,
                email: inputEmail.toLowerCase()
            });
        }
    }else{
        flashError('Please complete all fields', feedbackP);
    }
    // attempt signup
    async function signup(data){
        const response = await fetch('/api/users/signup', {
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
        if (response.status === 200){
            flashSuccess('Account created', feedbackP)
            setTimeout(function() {
                location.href='menu';
            }, 500);
        }else {
            flashError(json.message+', please try again', feedbackP);
        }
    }
}
function signup(){

    // check inputs completed
    let inputUsername = document.getElementById('username').value.trim();
    let inputEmail = document.getElementById('email').value.trim();
    let inputPassword = document.getElementById('password').value.trim();

    if (inputEmail !== '' && inputPassword !== '' && inputUsername !== ''){
        signup({
            username: inputUsername, 
            password: inputPassword,
            email: inputEmail
        });
    }else{
        window.alert('Please complete all fields');
    }

    // attempt signup
    async function signup(data){
        const response = await fetch('/api/signup', {
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
            alert('Account created');
            location.href='menu';
        }else {
            if (response.status === 401){
                alert(json.message);
            }else{
                if (json.error == 'user validation failed: email: Please enter a valid email'){
                    alert('Please enter a valid email');
                }
            }
        }
    }
}
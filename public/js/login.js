function login(){

    // check inputs completed
    let inputUsername = document.getElementById('username').value.trim();
    let inputPassword = document.getElementById('password').value.trim();
    if (inputUsername !== '' && inputPassword !== '') {
        login({ 
            username: inputUsername, 
            password: inputPassword
        });
    }else{
        window.alert('Please enter username and password to continue'); 
    }

    // attempt login
    async function login(data){
        const response = await fetch('/api/login', {
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
            alert(json.message+', please try again');
        }
        if (response.status === 200){
            alert('Logged in')
            // console.log(json.user)
            location.href='menu';
        }
    }
}
async function logout(){
    let response = await fetch('/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    .catch(err => {
        console.log('Request Failed', err);
    });
    if (response.status === 200){
        alert('Logged out')
        location.href='index';
    }else{
        console.log('Problem logging out');
        location.href='index';
    }
}
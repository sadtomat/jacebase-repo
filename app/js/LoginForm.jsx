import React from 'react';

export function LoginForm() {
    function handleSubmit(e) {
        const form = e.target;
        const formData = new FormData(form);
        const username = formData.get('username');
        alert('Username: ' + username);
        e.preventDefault();
    }

    function handleClick(e){
        console.log("click");
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit} onClick={handleClick}>
            <label>
                Username:
                <input type='text' name='username'/>
            </label>
            <button type='submit'/>
        </form>
    );

}
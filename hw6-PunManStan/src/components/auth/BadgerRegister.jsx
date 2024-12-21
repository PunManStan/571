import { React} from 'react';
import {Form, Button} from 'react-bootstrap';

export default function BadgerRegister() {
    
    // TODO Create the register component.
    //1)create form
    //2)mask pin and confirm pin 
    //3)check pins 

    //4)perform API request
    //5)perform user alert
    //6)apply credentials to context
    function regUser(username, password){
        fetch(`https://cs571api.cs.wisc.edu/rest/su24/hw6/register`, {
            method:"POST",
            credentials:"include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type" : "application/json"
            },body: JSON.stringify({
                "username":username,
                "pin":password
            })
        }).then(res => {
            if(res.status===409){
                alert("That username has already been taken!");
            }
            if(res.status===200){
                alert("Regestration was a success!");
            }
        }
        )
        }
    
    function checkPins(){
        const username = document.getElementById("usernameID").value;
        const password = document.getElementById("passwordID").value;
        const pcheck = document.getElementById("pCheckID").value;
        let re = new RegExp(/^\d{7}$/);
        if(username=="" || password=="" || pcheck==""){
            alert("You must provide both a username and pin!");
            return "";
        }
        if(password!==pcheck){
            alert("Your pins do not match!");
            return;
        }
        if((re.test(password))==false){
            alert("Your pin must be a 7-digit number!");
            return;
        }
       regUser(username, password);


    }   
    return <>
        <h1>Register</h1>
        <hr/>
        <Form>
            <Form.Group className='regesterForm'>
                <Form.Label  htmlFor="usernameID">Username</Form.Label>
                <Form.Control id = "usernameID" type="username" placeholder ="Enter username"/>
                <Form.Label  htmlFor="passwordID">Password</Form.Label>
                <Form.Control  id = "passwordID" type = "password" name = "password" placeholder='Password' />
                <Form.Label  htmlFor="pCheckID">Repeat Password</Form.Label>
                <Form.Control id = "pCheckID" type = "password" name="password" placeholder='lets check your password' />
            </Form.Group>
            <hr/>
            <Button onClick={()=>checkPins()} >Register</Button>
        </Form>
    </>
}

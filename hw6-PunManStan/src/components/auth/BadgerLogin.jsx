import { React, useContext} from 'react';
import {Form, Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';




export default function BadgerLogin() {
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();
    // TODO Create the login component.
    function checkPins(){
        const username = document.getElementById("usernameID").value;
        const password = document.getElementById("passwordID").value;
        
        let re = new RegExp(/^\d{7}$/);
        if(username=="" || password==""){
            alert("You must provide both a username and pin!");
            return "";
        }
        if((re.test(password))==false){
            alert("Your pin must be a 7-digit number!");
            return;
        }
       logUser(username, password);
    
    
    } 
    
    function logUser(username, password){
        
        
        fetch(`https://cs571api.cs.wisc.edu/rest/su24/hw6/login`, {
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
            if(res.status===401){
                alert("That username or pin is incorrect!");
            }
            if(res.status===200){
                setLoginStatus(true);
                sessionStorage.setItem("login", JSON.parse(true));
                alert("Login was a success!");
                navigate("/")
    
            }
        }
        )
        }
    return <>
        <h1>Login</h1>
        <hr/>
        <Form>
            <Form.Group className='regesterForm'>
                <Form.Label  htmlFor="usernameID">Username</Form.Label>
                <Form.Control id = "usernameID" type="username" placeholder ="Enter username"/>
                <Form.Label  htmlFor="passwordID">Password</Form.Label>
                <Form.Control  id = "passwordID" type = "password" name = "password" placeholder='Password' />
            </Form.Group>
            <hr/>
            <Button onClick={()=>checkPins()} >Register</Button>
        </Form>
    </>
}

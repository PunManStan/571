import React, { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

import crest from '../../assets/uw-crest.svg'
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";
import BadgerChatroom from "../content/BadgerChatroom";


function BadgerLayout(props) {

    // TODO @ Step 6:
    // You'll probably want to see if there is an existing
    // user in sessionStorage first. If so, that should
    // be your initial loginStatus state.
    if(sessionStorage.getItem("login")!=""){

    }
    const [loginStatus, setLoginStatus] = useState(false)
    
    
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            alt="BadgerChat Logo"
                            src={crest}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        BadgerChat
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="login" >Login</Nav.Link>
                        <Nav.Link as={Link} to="register">Register</Nav.Link>
                        <NavDropdown title="Chatrooms" id="nav-dropdown-chat">
                            {
                                /* TODO Display a NavDropdown.Item for each chatroom that sends the user to that chatroom! */
                                props.chatrooms.map(prop => {
                                    return <NavDropdown.Item  key={prop} as={Link} to={`/chatrooms/${prop}`}>{prop}</NavDropdown.Item>
                                })
                            }
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            <div style={{ margin: "1rem" }}>
                <BadgerLoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
                    <Outlet />
                </BadgerLoginStatusContext.Provider>
            </div>
        </div>
    );
}

export default BadgerLayout;
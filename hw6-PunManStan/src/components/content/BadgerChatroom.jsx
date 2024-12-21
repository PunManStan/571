import React, { useEffect, useState } from "react"
import { Col, Container, Row, Pagination } from "react-bootstrap";
import BadgerMessage from "./BadgerMessage";

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [activePage, setActive] = useState([1]);

    
    

    function displayMessages(){
        if(messages.length/25 <activePage){
            return <p>No messages to display on this page.</p>
        }
       return<div>
        <Row>{messages.slice((activePage-1) * 25, activePage * 25).map(message =>
            <Col xs={1} sm={1} md={2} lg={3} xl={3} xxl={3}  key = {message.id}><BadgerMessage {...message}/></Col>
        )}</Row>
        
       </div> 
    }

    function displayPagenation(){
        return <Pagination id="message-Pages">
            <Pagination.Item active={1==activePage}  onClick ={()=>setActive(1)} >{1}</Pagination.Item>
            <Pagination.Item active={2==activePage} onClick ={()=>setActive(2)} >{2}</Pagination.Item>
            <Pagination.Item active={3==activePage}  onClick ={()=>setActive(3)} >{3}</Pagination.Item>
            <Pagination.Item active={4==activePage}  onClick ={()=>setActive(4)} >{4}</Pagination.Item>
        </Pagination>
    }
    const loadMessages = () => {
        fetch(`https://cs571api.cs.wisc.edu/rest/su24/hw6/messages?chatroom=${props.name}&page=1`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };


    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [props]);
    console.log(messages);
    return <>
        <h1>{props.name} Chatroom</h1>
        {
            /* TODO: Allow an authenticated user to create a post. */
        }
        <hr/>
        {
            messages.length > 0 ?
                <>
                <Container >
                    
                        {activePage ? displayMessages() : "still laoding"}
                  
                </Container>
                </>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        }
        <hr/>
        {activePage? displayPagenation(): "Still Loading"}
    </>
}

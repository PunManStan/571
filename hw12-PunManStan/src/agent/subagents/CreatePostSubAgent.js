import { isLoggedIn, logout, ofRandom } from "../Util";

const createPostSubAgent = (end) => {
    
    let stage;
    let title, content, chatroom;
    const handleInitialize = async (promptData) => {
        chatroom = sessionStorage.getItem("promptData");
        console.log(chatroom);
        sessionStorage.clear();
       
       stage = "CONTENT";
       
   
    
       if (await isLoggedIn()) {
        return "Great what should the title be?";
    } else { 
       return end(ofRandom([
            "You are not logged in, try logging in first.",
            "You are not signed in, try signing in first."
        ]))

    }
}

    const makeContent = async (prompt) =>{
        title = prompt;
        stage = "BODY";
        return "Alright, and what do you want to say?";
    }

    const makeContentBody = async (prompt) =>{
        content = prompt;
        stage = "CONFIRM";
        return "Are you sure you want to make this post: TITLE: " + title + " BODY: " +content; 
    }

    const confirmPost = async(prompt) => {
        if(prompt != "yes"){
            return end(ofRandom[
                "canceling post",
                "okay, we can scrap that then"
            ])
        }
        stage = "POST";
        return makePost();
    }
    const makePost = async(prompt) =>{
        
       
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/su24/hw12/messages?chatroom=" + chatroom, {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json",
                
                
            },
            body: JSON.stringify({
                title : title,
                content: content
            })
        })
        
        return end("All set! Your post has been made to " + chatroom);
    }
    const handleReceive = async (prompt) => {
        console.log(prompt);
        switch(stage){
            case "CREATE": return await handleInitialize(prompt);
            case "CONTENT": return await makeContent(prompt);
            case "BODY": return await makeContentBody(prompt);
            case "CONFIRM" : return await confirmPost(prompt);
            case "POST": return await makePost(prompt);
            
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createPostSubAgent;
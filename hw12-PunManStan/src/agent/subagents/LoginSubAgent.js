import AIEmoteType from "../../components/chat/messages/AIEmoteType";
import { isLoggedIn, logout, ofRandom } from "../Util";

const createLoginSubAgent = (end) => {

    let stage;
    let username, password;
    
    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            return end(ofRandom([
                "You are already logged in, try logging out first.",
                "You are already signed in, try signing out first."
            ]))
        } else {
            stage = "FOLLOWUP_USERNAME";
            return ofRandom([
                "Sure, what is your username?",
                "Alright, what is your username?"
            ])
        }

    }

    const handleReceive = async (prompt) => {
        switch(stage){
            case "FOLLOWUP_USERNAME": return await followupUsername(prompt);
            case "FOLLOWUP_PASSWORD": return await followupPassword(prompt);
        }
    }

    const followupUsername = async(prompt)=>{
        username = prompt;
        stage = "FOLLOWUP_PASSWORD";
        let expression;
        return expression={
            msg: ofRandom([
            "Great, and what is your password?",
            "Thanks, and what is your password?"]),
            nextIsSensitive:true,

    }
    }


    const followupPassword = async (prompt) => {
        password = prompt;
        
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/su24/hw12/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId(),
                
            },
            body: JSON.stringify({
                username: username,
                pin: password
            })
        })
        if(resp.status ===200){
            
            let expression ={
                msg: ofRandom([
                    "Woo hoo! You did it! You're logged in!",
                    "Awesome, you have been signed in, you're welcome.",
                    "That seems right. . . looks like you're all logged in."
                ]),
                emote: AIEmoteType.SUCCESS,
            }
           
            return end(expression);

        }else{
            console.log(resp);

            let expression ={
                msg: ofRandom([
                        "OOOO, looks like you made a mistake. Username or pasword is wrong.",
                        "Sorry to say, I don't recognize that username and password combo. Try again."
                ]),
                emote: AIEmoteType.ERROR,
            }

            return end(expression);
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createLoginSubAgent;
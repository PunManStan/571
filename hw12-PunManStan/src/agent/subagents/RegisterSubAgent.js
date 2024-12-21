import AIEmoteType from "../../components/chat/messages/AIEmoteType";
import { isLoggedIn, logout, ofRandom } from "../Util";

const createRegisterSubAgent = (end) => {

    let stage;
    let pin,username;
    let expression;
    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            return end(ofRandom([
                "You are already logged in, try logging out first.",
                "You are already signed in, try signing out first."
            ]))
        } else {
            stage = "FOLLOWUP_USERNAME";
            return ofRandom([
                "Sure, what would you like your username to be?",
                "Alright, what is your new username?"
            ])
        }

    }

    const handleReceive = async (prompt) => {
        switch(stage){
            case "FOLLOWUP_USERNAME": return await followupUsername(prompt);
            case "FOLLOWUP_PASSWORD": return await followupPassword(prompt);
            case "FOLLOWUP_CERTPIN" : return await followupCertPin(prompt);
            case "FOLLOWUP_REG"     : return await followupReg();
        }
    }

    const followupUsername = async(prompt)=>{
        username = prompt;
        stage = "FOLLOWUP_PASSWORD";
        return expression={
            msg:ofRandom([
            "Fantastic, and what will your pin be? Has to be 7 digits btw.",
            "coolio, and what is your new pin? Gonna have to be 7 digits."
        ]),
        nextIsSensitive:true,
    }
    }

    const followupCertPin = async(prompt) =>{
      
        if(pin !==prompt){
            return end(expression ={
                msg : ofRandom([
                "LOUD WRONG ASNWER BUZZER NOISE, you're pin must match your original input.",
                "WRONG, your pin inputs must match",
                "Woops that doesnt match you desired pin"
            ]),
            emote : AIEmoteType.ERROR,
        })
        }
        stage = "FOLLOWUP_REG";
       
        return followupReg();
    }

    const followupPassword = async(prompt) =>{
        pin = prompt;
        stage = "FOLLOWUP_CERTPIN";
        let expression;
        return expression = {
            msg:ofRandom([
            "Last step, confirm your pin.",
            "Could you confirm that pin for me?",
            "One last thing, confirm that input for me."
        ]),
        nextIsSensitive:true,
    }
        
    }
    const followupReg = async () => {
       
        
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/su24/hw12/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId(),
                
            },
            body: JSON.stringify({
                username: username,
                pin: pin
            })
        })
        console.log(resp.status);
        if(resp.status ===200){
            return end( expression = {
                msg: ofRandom([
                "Woo hoo! You did it! You're registed!",
                "Awesome, you have been registered, you're welcome.",
                "That seems right. . . looks like you're all registered."
            ]),
            emote : AIEmoteType.SUCCESS,
        })

        }if(resp.status===409){
            
            return end(expression={
                msg:"This username already exist.",
                emote:AIEmoteType.ERROR,
            })
        }
        if(resp.status===400){
            return end(expression={
                msg:"Pin must be exactly 7 digits.",
                emote:AIEmoteType.ERROR,
            })
        }
        
        if(resp.status===413){
          
            return end(expression={
                msg:"'username' must be 64 characters or fewer",
                emote:AIEmoteType.ERROR,
            })
        }
    }
    return {
        handleInitialize,
        handleReceive
    }
}

export default createRegisterSubAgent;
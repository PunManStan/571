import createChatDelegator from "./ChatDelegator";
import { isLoggedIn, logout, ofRandom } from "./Util";
import AIEmoteType from "../components/chat/messages/AIEmoteType";
const createChatAgent = () => {
    const CS571_WITAI_ACCESS_TOKEN = "QBI2LAFN3USZL7DPNVSY777WZAFUMMGN"; // Put your CLIENT access token here.
    const digit = /-?\d*\.{0,1}\d+/;
    const topMsgs =[];
    const delegator = createChatDelegator();
    let chatrooms = [];
    
    const handleInitialize = async () => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/su24/hw12/chatrooms", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        });
        const data = await resp.json();
        chatrooms = data;
        
        return "Welcome to BadgerChat! My name is Bucki, how can I help you?";
    }

    const handleReceive = async (prompt) => {
        if (delegator.hasDelegate()) { return delegator.handleDelegation(prompt); }
        const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        })
        const data = await resp.json();
        if (data.intents.length > 0) {
            switch (data.intents[0].name) {
                case "get_help": return handleGetHelp();
                case "get_chatrooms": return handleGetChatrooms();
                case "get_messages": return handleGetMessages(data);
                case "login": return handleLogin();
                case "register": return handleRegister();
                case "create_message": return handleCreateMessage(data);
                case "logout": return handleLogout();
                case "whoami": return handleWhoAmI();
            }
        }
        return "Sorry, I didn't get that. Type 'help' to see what you can do!";
    }

    const handleGetHelp = async () => {
        return ofRandom([
            "My name is BadgerMart Voice. I'm an interactive shoping assistant. I can show you our inventory, individual prices, and manage your shopping cart! Just let me know what you need! :)",
            "You can prompt me a few ways. For example: Show me the most recent message from Witte.",
            "There are several things I can do for you.",
            "Try asking 'give me a list of chatrooms', or ask for more help!",
            "Try asking 'register for an account', or ask for more help!",
        ])
    }

    const handleGetChatrooms = async () => {
        let chatNames ="Of course, there are " + chatrooms.length +" chatrooms:  ";
        for(let i = 0; i<chatrooms.length; i++){
                chatNames += chatrooms[i] + ", ";
        }
        chatNames = chatNames.slice(0, -2);

        chatrooms.concat(".");
        return chatNames;
    }

    const handleGetMessages = async (data) => {
        
        let specified = data.entities["classrooms:classrooms"] ? true : false;
        let room = "none";
        let quant;
        let message;
        
        if(data.text.match(digit)){
            quant = data.text.match(digit);
            quant = quant[0];
            if(quant <=0 || quant>10){
                return "please specify a positive number.";
            }
        }else{
            quant = 1;
        }
        if(specified){
            room = data.entities["classrooms:classrooms"][0].value;
            
        }else{
            
            room = await getRecentMessages();
            console.log(room);
            
        }
       
       
      
        
        console.log(room, quant);
            const resp = await fetch("https://cs571api.cs.wisc.edu/rest/su24/hw12/messages?chatroom="+room + "&num="+ quant, {
                headers: {
                   "X-CS571-ID": CS571.getBadgerId()
                }
            });
            message = await resp.json();
        
         
        
        

        return message.messages.map(msg => "In " + msg.chatroom + ", " + msg.poster + "created a post titled " + msg.title + " saying " + msg.content);
    }

    const getRecentMessages = async()=>{
       let topMsgs=[];
        let maxDate = new Date(1968);
        let room;
     
        for(let i = 0; i < chatrooms.length; i++){
           
           
            const resp = await fetch("https://cs571api.cs.wisc.edu/rest/su24/hw12/messages?messages?chatroom=" +chatrooms[i]+ "&num=1", {
                headers: {
                   "X-CS571-ID": CS571.getBadgerId()
                }
            });
            topMsgs.push(await resp.json()); 
            
        }
       
        for(let msg of topMsgs){
            
            if(maxDate < msg.messages[0].created){
                maxDate = msg.messages[0].created;
                room = msg.chatroom;
            }
        }
        console.log(topMsgs)
        return topMsgs[0].messages[0].chatroom;
        
     

    }
    const handleLogin = async () => {
        return await delegator.beginDelegation("LOGIN");
    }

    const handleRegister = async () => {
        return await delegator.beginDelegation("REGISTER");
    }

    const handleCreateMessage = async (data) => {
        if(!isLoggedIn()){
            return "You must be logged in to make a post.";
        }
        const hasRoom = data.entities["classrooms:classrooms"] ? true: false;
        if(!hasRoom){
            return "A chatroom must be specified to make a post.";
        }
        sessionStorage.setItem("promptData",JSON.stringify(data.entities["classrooms:classrooms"][0].value));
        return await delegator.beginDelegation("CREATE");
    }

    const handleLogout = async () => {
        if(await isLoggedIn()){
            await logout();
            return ofRandom([
                "See you later alligator! You've been logged out!",
                "Goodbye! You've been logged out successfully!",
                "Hope to see you soon! You've been logged out."
            ])
        }
        else{
            return ofRandom([
                "Oops it appears you never logged in. :(",
                "You never logged in.",
                "You aren't logged in",
                "You are not currently logged in"
            ])
        }
    }

    const handleWhoAmI = async () => {
        let info;
        console.log(isLoggedIn());
        let status = await isLoggedIn();
        if(status){
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/su24/hw12/whoami", {
            credentials:"include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                
            },
            
        })
        info = await resp.json();
        console.log(info);
        return "You are logged in as " +info.user.username+".";
       }else{
            return ofRandom([
                "You are not logged in.",
                "Try loggin in"
            ])
       }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;

const createChatAgent = () => {

    const CS571_WITAI_ACCESS_TOKEN = "MMH4EZUYJRX57FSWUKNYN5ADXRRUD34U"; // Put your CLIENT access token here.

    let person;

    const handleInitialize = async () => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/su24/hw10/person", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        const data = await resp.json();
        person = data;

        return "Welcome to BadgerBook Chat! :) Type your question, or ask for help if you're lost!";
    }

    const handleReceive = async (prompt) => {
        const resp = await fetch("https://api.wit.ai/message?q=" + encodeURIComponent(prompt), {
            headers: {
                "Authorization": "Bearer " + CS571_WITAI_ACCESS_TOKEN
            }
        })
        const data = await resp.json();

        console.log(data);

        if(data.intents.length > 0){
            switch(data.intents[0].name){
                case "get_help" : return getHelp();
                case "get_name" : return getName();
                case "get_home_country" : return getCountry();
                case "get_preference" : return  getPreference();
                case "next_person" : return nextPerson();
            }
        }

        return "Sorry, I didn't get that. Type 'help' to see what you can do."
    }

    const getHelp = async() => {
        return "I'm an interactive chat agent. You can learn my name, home country, and pet prefrences! :)"
    }

    const getName = async() => {
        return "My name is " +person.name+ "!";
    }

    const getPreference = async() =>{
        if(person.favorites.prefers !="cat"){
           return "I love " +person.favorites.prefers+ "s! Specifically my favorite type is the " +person.favorites.dog +".";
        }
        let pet = person.favorites.prefers;
        return "I love " +person.favorites.prefers+ "s! Specifically my favorite type is the " +person.favorites.cat +".";
    }

    const getCountry = async() => {
       return "My home country is "+ person.country+ ".";
    }

    const nextPerson = async() => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/su24/hw10/person", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        const data = await resp.json();
        person = data;

        return "See ya later alligator! You may begin chatting with the next person!";
    }


    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;
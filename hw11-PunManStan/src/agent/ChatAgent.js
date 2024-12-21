
const createChatAgent = () => {

    const CS571_WITAI_ACCESS_TOKEN = "KSKWNPCIW6BA25K4JYGHL6NEISYVONRE"; // Put your CLIENT access token here.
     
    let availableItems = [];
    let cart = [];
    const digit = /-?\d*\.{0,1}\d+/;

    const handleInitialize = async () => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/su24/hw11/items", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        const data = await resp.json();
        availableItems = data;
        console.log(availableItems);
        return "Welcome to BadgerMart Voice! :) Type your question, or ask for 'help' if you're lost!";
    }

    const handleReceive = async (prompt) => {
        // TODO: Replace this with your code to handle a user's message!
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
                case "get_items" : return get_items();
                case "get_price" : return get_price(data);
                case "add_item" : return  add_item(data);
                case "remove_item" : return remove_item(data);
                case "view_cart" : return view_cart();
                case "checkout" : return checkout();
            }
        }
        return "Sorry, I didn't quit get that. Type 'help' to see what I can do!";
    }

    const getHelp = async() => {
        return "My name is BadgerMart Voice. I'm an interactive shoping assistant. I can show you our inventory, individual prices, and manage your shopping cart! Just let me know what you need! :)"
    }

    const get_items = async() => {
        let itemDesc = "We have "
        for(let i = 0; i<availableItems.length; i++){
            if(i==availableItems.length-1){
                itemDesc = itemDesc.concat(" and ", availableItems[i].name.concat("s"));
                break;
            }
            itemDesc = itemDesc.concat(availableItems[i].name, "s, ");
        }
        itemDesc = itemDesc.concat(" for sale!");

        return itemDesc;
    }

    const get_price= async(data) =>{
        let str = data.text.toUpperCase();
        for(let i = 0; i<availableItems.length; i++){
            if(str.includes(availableItems[i].name.toUpperCase())){
                let cost = availableItems[i].price;
                return availableItems[i].name + "s are " + Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(cost) + " each.";
            }
        }
        return "Specify an item in our inventory. ";
       
    }

    const add_item = async(data) =>{
        
        let str = data.text.toUpperCase();
        let item = "none";
        let quant = str.match(digit);
        console.log(quant)
        if(quant ==null){
            quant = 1;
        }
        if(quant <=0){
            return "please specify a positive number.";
        }
        quant = Math.floor(quant);
        for(let i = 0; i<availableItems.length; i++){
            if(str.includes(availableItems[i].name.toUpperCase())){
                if(quant <=0){
                    return "please specify a real number of " + item.concat("s");
                }
                item = availableItems[i].name;
                cart[i] = quant;
            }

        }
        console.log(cart);
        if(item=="none"){
            return "Please specify an item we have in inventory. ";
        }

        
        

        return "Adding " + quant +" "+ item.concat("s") + " to your cart.";
    }


    const remove_item = async(data) => {
        
        let str = data.text.toUpperCase();
        console.log(str);
        let quant = str.match(digit);
        let item = "none";
        
        if(quant ==null){
            quant = 1;
        }
        if(quant <=0){
            return "please specify a positive number.";
        }
        quant = Math.floor(quant);
        for(let i = 0; i<availableItems.length; i++){
            if(str.includes(availableItems[i].name.toUpperCase())){
                item = availableItems[i].name;
                
                if(quant <=0){
                    return "please specify a real number of " + item.concat("s");
                }

                if(quant > cart[i]){
                    return "Cannot remove more items than you put in.";
                }
                cart[i] = cart[i] - quant;
            }

        } 
        
        

        
        console.log(cart);
        if(item=="none"){
            return "Please specify an item we have in inventory. ";
        }
       

        return "Removed from cart.";
    }

    const view_cart = async() => {
        let price = 0; 
        let output = "You have ";
        for(let i = 0; i < cart.length; i++){
            if(cart[i]!=null && cart[i]!=0){
                price += availableItems[i].price * cart[i];
                output = output.concat(cart[i] +" ",availableItems[i].name.concat("s, "));

            }

        }
        if(price <=0){
            return "Your cart is empty.";
        }
        output = output.concat("in your cart, ", "totaling ".concat(Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(price)) + ".");
        
        return output;
    }

    const checkout = async() => {
        let price = 0;

        for(let i = 0; i < availableItems.length; i++){
            if(cart[i]!=null && cart[i]!=0){
                price += availableItems[i].price * cart[i];

            }
            if(cart[i]==null){
                cart[i] = 0;
            }
        }
        if(price <=0){
            return "Your cart is empty.";
        }
        console.log(cart);
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/su24/hw11/checkout", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "X-CS571-ID": CS571.getBadgerId(),
                
            },
            body:JSON.stringify({
                "Apple" : cart[0],
                "Bagel" : cart[1],
                "Coconut" : cart[2],
                "Donut" : cart[3],
                "Egg" : cart[4],
            })
        })
        const data = await resp.json();
        console.log(data);
        return data.msg + "Your confirmation ID is " + data.confirmationId;
    }
    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;
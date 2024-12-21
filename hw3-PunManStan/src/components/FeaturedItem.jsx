import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';

export default function FeaturedItem(props) {
    //props is set in BadgerMart in UserEffect()
   
    const [btnTxt, setTxt] =useState("See Nutritional Facts");
    const [clicks, setClicks] = useState(1);
    // const item = document.createElement("img");
    // let itemName = document.createElement("h6");
    // let itemPrice = document.createElement("p");
    // let itemDesc = document.createElement("p");

    // item.src = props.img;
    // itemName.innerText = props.name;
    // itemPrice.innerText = props.price;
    // itemDesc.innerText = props.description;

    // item.appendChild(itemName);
    // itemName.appendChild(itemPrice);
    // item.appendChild(itemDesc);
    
    function updateFunc(){
        setClicks(clicks +1);
        let text = "See Nutritional Facts";
        if(clicks%2===0){
            text = "Hide Nutrional Facts";
            
        }
        setTxt(btnTxt => btnTxt = text);
    }

    return <card>
       <img> src= props.img alt = props.name width = "600px" height= "600px" </img>
<h5> props.name + "(" + props.name + ")" </h5>

 <p>props.description</p>
 <Button variant="outline-info" id="nutr" onClick = { () => updateFunc()}>{btnTxt}</Button>{' '}
    </card>
}
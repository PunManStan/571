function setData(){
	return fetch("https://cs571api.cs.wisc.edu/rest/su24/hw2/students", {
	headers: {
		"X-CS571-ID": CS571.getBadgerId()
	}
})
.then(res => {
	if (res.status === 200 || res.status === 304) {
		return res.json()
	} else {
		throw new Error();
	}
})
.then(data => {
	console.log(data);
	document.getElementById("num-results").innerText = data.length;
	return data;
})
.catch(err => {
	console.error("Could not get student data.");
})

}

function buildStudents(studs) {
	// TODO This function is just a suggestion! I would suggest calling it after
	//      fetching the data or performing a search. It should populate the
	//      index.html with student data by using createElement and appendChild.
	
	if(studs===null){
		return;
	}

	for(let i = 0; i<studs.length; i++){
		let desc = "This student is from Wisconsin.";
			let newName = document.createElement("h1");
			newName.className = "col";
			let newMajor = document.createElement("h6");
			
			let statNative = document.createElement("h6");
			
			let newInterest = document.createElement("ul");
			
			
			newName.innerText = studs[i].name.first + " " + studs[i].name.last;
			newMajor.innerText = studs[i].major + " (Current Credits: " + studs[i].numCredits + ")";

			
			
			//checks nativety status
			if(studs[i].fromWisconsin){
				desc = "This student is not from Wisconsin.";
			}

			statNative.innerText = desc; 

			document.getElementById("students").appendChild(newName);

			newName.appendChild(newMajor);
			newName.appendChild(statNative);
			
			//adds to ul
			for(let j =0; j<studs[i].interests.length;j++ ){
				let interest = document.createElement("li");
				interest.innerText = studs[i].interests[j];
				newInterest.appendChild(interest);
			}

			newName.appendChild(newInterest);
		}	
}

function handleSearch(e) {
	
	e.preventDefault(); // You can ignore this; prevents the default form submission!
	let sName = document.getElementById("search-name").value.trim().toLowerCase();
	let sMajor = document.getElementById("search-major").value.trim().toLowerCase();
	let sInterest = document.getElementById("search-interest").value.trim().toLowerCase();
	
	let search;
	setData().then(data => {
		search = data;
		let results = search.filter((stud) => {
			let fname = stud.name.first.toLowerCase();
			let lname = stud.name.last.toLowerCase();
			
			if(fname.includes(sName)){
				return true;
			}
			if(lname.includes(sName)){
				return true;
			}
			
		}
		
			

		);

		let moreResults = search.filter((stud) => {
			
			let maj = stud.major.toLowerCase();
			console.log(sMajor);
			if(maj.includes(sMajor)){
				return true;
			}
		}
		);

		let evenMoreResults = search.filter((stud) => {
	
		for(let i = 0; i < stud.interests.length; i++){
			let intres =  stud.interests[i].toLowerCase();
			if(intres.includes(sInterest)){
				return true;
			}
		}
		
		
	}
		)
		//results.concat(moreResults);
		//results.concat(evenMoreResults);
		console.log(results);
		document.getElementById("num-results").innerText = results.length;
		document.getElementById("students").innerHTML = "";
		buildStudents(results);
	}
	);
	
}


let student;
setData().then(data => {
	//I needed to see this reddit comment to realize you can just pass param. in a .then post
	//https://www.reddit.com/r/learnjavascript/comments/1d8x9lo/comment/l79bxag/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button	
	buildStudents(data);
	document.getElementById("search-btn").addEventListener("click", handleSearch);
});


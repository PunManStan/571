function submitApplication(e) {
    e.preventDefault(); // You can ignore this; prevents the default form submission!
    document.getElementById("btn-apply").addEventListener("click", () => {
      let jobs = document.getElementsByName('job');
      let selection = "JOB";
      for(let i = 0; i <jobs.length; i++){
        if(jobs[i].checked == true){
            
            selection = jobs[i].value;
            
        }
      }
      alert("Thank you for applying to be a " + selection + "!");
    });
    
    
}
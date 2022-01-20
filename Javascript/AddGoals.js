async function startGoalPage() {
    let goal = await getGoalSingle();
    window.localStorage.setItem('goalCalories', goal.calories);
    window.localStorage.setItem('goalProtein', goal.protein);
    window.localStorage.setItem('goalFat', goal.fat);
    window.localStorage.setItem('goalCarb', goal.carbs);
    
    document.getElementById("textDisplayGoal").innerHTML = "Calories: "+goal.calories+
                                     "<br />Protein: "+goal.protein+
                                     "g<br/>Fat: "+goal.fat+
                                     "g<br/>Carbs: "+goal.carbs + "g";
}

async function addGoal() {
    
    if(username === null) {
        while(1) {alert("YOU SHOULDNT BE HERE");}
    }
    
    let cal = parseInt(document.getElementById("calGoalInput").value);
    let pro = parseInt(document.getElementById("proteinGoalInput").value);
    let carb = parseInt(document.getElementById("carbGoalInput").value);
    let fat = parseInt(document.getElementById("fatGoalInput").value);
    
    if(isNaN(cal) || cal < 0) { cal = window.localStorage.getItem('goalCalories'); }
    if(isNaN(pro) || pro < 0) { pro = window.localStorage.getItem('goalProtein'); }
    if(isNaN(carb) || carb < 0) { carb = window.localStorage.getItem('goalCarb'); }
    if(isNaN(fat) || fat < 0) { fat = window.localStorage.getItem('goalFat'); }

    let goal = {calories: cal, protein: pro, carbs: carb, fat: fat};

    let url = urlBase+'/'+username+'/'+'updateGoal';

    await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                calories: goal.calories,
                protein: goal.protein,
                carbs: goal.carbs,
                fat: goal.fat
            }
        )
    })
    .catch(err => alert(err));
    
    
    document.getElementById("textDisplayGoal").innerHTML = "Calories: "+goal.calories+
                                     "<br />Protein: "+goal.protein+
                                     "g<br/>Fat: "+goal.fat+
                                     "g<br/>Carbs: "+goal.carbs + "g";
                                     
    let x = document.createElement("p");
        x.innerHTML = "Goal has been updated!"
        
    if(!document.getElementById("textDisplayGoalDisplay").hasChildNodes()) {
        document.getElementById("textDisplayGoalDisplay").appendChild(x);
    } else {
        document.getElementById("textDisplayGoalDisplay").removeChild(document.getElementById("textDisplayGoalDisplay").firstChild);
        setTimeout(function () {
            document.getElementById("textDisplayGoalDisplay").appendChild(x);
        }, 50);
    }
}
//Used to display the daily total values of stuff
let runningTotals = {calories: 0, protein: 0, carbs: 0, fat: 0};

//Used to track which buttons have been pressed and their counts
let tempItems = [];

//List to track items in the DB and their macro values
let predefinedFoods = [];

//List to track all foods the user has input today
let foodsReceivedFromDatabase = [];

//Main
async function addAllFields() {
    if(username === null) {
        while(1) { alert("YOU SHOULDNT BE HERE"); }
    }
    
    await getItemsInList();
    
    let goal = await getGoalSingle();
    window.localStorage.setItem('currentGoalCalories', goal.calories);
    window.localStorage.setItem('currentGoalProtein', goal.protein);
    window.localStorage.setItem('currentGoalFat', goal.fat);
    window.localStorage.setItem('currentGoalCarbs', goal.carbs);
    
    addAllPredefined();
    await getOtherTotalsAndAppend(true);
    await getPredefinedTotalsAndAppend(true);
    
    addEnterListeners();
}

function addButtonAndAppend(name, elementId) {
    let leftElement = document.createElement("button");
        leftElement.innerHTML = "-";
        leftElement.type = "button";
        leftElement.id = name+"LftBtn";
        leftElement.style.width = '30px';
        leftElement.style.height = '30px';
        leftElement.style.fontSize = '12px';
        leftElement.style.borderRadius = '5px';
        // leftElement.style.position = 'relative';
        // leftElement.style.top = '2%';
        
    let rightElement = document.createElement("button");
        rightElement.innerHTML = "+";
        rightElement.type = "button";
        rightElement.id = name+"RgtBtn";
        rightElement.style.width = '30px';
        rightElement.style.height = '30px';
        rightElement.style.fontSize = '12px';
        rightElement.style.borderRadius = '5px';
        // rightElement.style.position = 'relative';
        // rightElement.style.top = '2%';
        
    let element = document.createElement("button");
        element.innerHTML = name+"<br />0";
        element.type = "button";
        element.id = name+"Btn";
        element.style.width = '70px';
        element.style.height = '70px';
        element.style.fontSize = '11px';
        // element.style.position = 'relative';
        element.style.wordWrap = 'break-word';
        
    let x = predefinedFoods.find(s => s.name === name);

    rightElement.onclick = function () {
        addToRunningTotals(x.calories, x.protein, x.carbs, x.fat);
        x.count++;
        document.getElementById(x.name+"Btn").innerHTML = x.name+"<br />"+x.count;
        tempItems.push(x.name);
    };
    leftElement.onclick = function () {
        if(x.count > 0) {
            subtractFromRunningTotals(x.calories, x.protein, x.carbs, x.fat);
            x.count--;
            document.getElementById(x.name+"Btn").innerHTML = x.name+"<br />"+x.count;
            if(x.count === 0) {
                tempItems = tempItems.filter(e => e !== x.name);
            }
        }
    };
    element.onclick = function () {
        writeToCanvas(x);
    }

    document.getElementById(elementId).appendChild(leftElement);
    document.getElementById(elementId).appendChild(element);
    document.getElementById(elementId).appendChild(rightElement);
    document.getElementById(elementId).appendChild(document.createElement("br"));
    
    console.log(leftElement.id +" : "+rightElement.id);
}

function validateUserInput() {
    let name = document.getElementById("nameInput").value;
    let cal = parseInt(document.getElementById("calInput").value);
    let pro = parseInt(document.getElementById("proteinInput").value);
    let carb = parseInt(document.getElementById("carbInput").value);
    let fat = parseInt(document.getElementById("fatInput").value);
    
    if(name.length > 33) {
        name = name.substring(0,33);
    }

    if(isNaN(cal) || cal < 0) { cal = 0; }
    if(isNaN(pro) || pro < 0) { pro = 0; }
    if(isNaN(carb) || carb < 0) { carb = 0; }
    if(isNaN(fat) || fat < 0) { fat = 0; }
    
    let food = {name: name, calories: cal, protein: pro, carbs: carb, fat: fat, count: 1, countUnmutable: 1, isPredefined: false};
    
    return food;
}

function filterButtons() {
    let input = document.getElementById("searchInput").value;
    let pat = new RegExp(input, 'i');
    
    for(let i = 0; i < predefinedFoods.length; i++) {
        let currentItem = document.getElementById(predefinedFoods[i].name+"Btn");
        let currentItemLeft = document.getElementById(predefinedFoods[i].name+"LftBtn");
        let currentItemRight = document.getElementById(predefinedFoods[i].name+"RgtBtn");
            
        if (pat.test(predefinedFoods[i].name)) {
            currentItem.style.visibility = 'visible';
            currentItemLeft.style.visibility = 'visible';
            currentItemRight.style.visibility = 'visible';
        }
        else {
            currentItem.style.visibility = 'hidden';
            currentItemLeft.style.visibility = 'hidden';
            currentItemRight.style.visibility = 'hidden';
        }
    }
}

function appendItemToListWithDeleteButton(name) {
    
    let foodItem = foodsReceivedFromDatabase.find(x => x.name === name)
    
    let appendMeUl = document.createElement("ul");
        appendMeUl.id = foodItem.name+"UlId";
        appendMeUl.style.position = 'relative';
        appendMeUl.style.listStyleType = 'none';
        appendMeUl.style.borderRadius = '25px';
        appendMeUl.style.bottom = '10%';
        appendMeUl.style.right = '15%';

    let appendMeLi = document.createElement("li");
        appendMeLi.id = foodItem.name+"LiId";
        appendMeLi.verticalAlign
        appendMeLi.style.display = 'inline-block';
        appendMeLi.style.width = '310px';
        appendMeLi.style.fontSize = '20px';
        appendMeLi.style.border = '2px dashed #D8D8D8';
        appendMeLi.style.borderRadius = '5px';
        appendMeLi.style.wordWrap = 'break-word';
        
    let appendMe = document.createElement("p");
        appendMe.id = foodItem.name+"ListItem";
        appendMe.style.width = '80%';
        appendMe.style.float = 'left';
        appendMe.innerHTML = foodItem.name + ": "+foodItem.count+
                         "<br><br/>Calories: "+foodItem.calories+
                         "<br/>Protein: "+foodItem.protein+
                         "g<br/>Fat: "+foodItem.fat+
                         "g<br/>Carbs: "+foodItem.carbs +"g";
    
    let appendMeBtn = document.createElement("button");
        appendMeBtn.type = "button";
        appendMeBtn.innerHTML = 'delete';
        appendMeBtn.style.width = '20%';
        appendMeBtn.style.height = '25px';
        appendMeBtn.style.fontSize = '14px';
        appendMeBtn.style.borderRadius = '5px';
        appendMeBtn.onclick = async function() {
            let food = foodsReceivedFromDatabase.find(x => x.name === name)
            
            let tmpCals = food.calories / food.count;
            let tmpProtein = food.protein / food.count
            let tmpCarbs = food.carbs / food.count
            let tmpFat = food.fat / food.count
            
            subtractFromRunningTotals(tmpCals, tmpProtein, tmpCarbs, tmpFat);
            
            food.calories -= tmpCals;
            food.protein -= tmpProtein;
            food.carbs -= tmpCarbs;
            food.fat -= tmpFat;
            food.count--;
            
            await deleteItem(food.name, food.isPredefined);
            
            if(food.count === 0) {
                document.getElementById(food.name+"UlId").remove();
            }
            else {
                document.getElementById(food.name+"ListItem").innerHTML = 
                    food.name + ": "+food.count+
                    "<br><br/>Calories: "+food.calories+
                    "<br/>Protein: "+food.protein+
                    "g<br/>Fat: "+food.fat+
                    "g<br/>Carbs: "+food.carbs +"g";
            }
        }
        
    appendMeLi.appendChild(appendMe);
    appendMeLi.appendChild(appendMeBtn);
    appendMeUl.appendChild(appendMeLi);
    
    document.getElementById("itemDisplay").appendChild(appendMeUl);
}

function refreshRunningTotal() {
    if(runningTotals.calories < 0) { runningTotals.calories = 0; }
    if(runningTotals.protein < 0) { runningTotals.protein = 0; }
    if(runningTotals.carbs < 0) { runningTotals.carbs = 0; }
    if(runningTotals.fat < 0) { runningTotals.fat = 0; }
    
    let cals = (runningTotals.calories / window.localStorage.getItem('currentGoalCalories')) * 100
    let protein = (runningTotals.protein / window.localStorage.getItem('currentGoalProtein')) * 100
    let fat = (runningTotals.fat / window.localStorage.getItem('currentGoalFat')) * 100
    let carbs = (runningTotals.carbs / window.localStorage.getItem('currentGoalCarbs')) * 100
    
    if(cals > 100) { document.getElementById("calorieProgressBarInner").style.width = '100%'; } else { document.getElementById("calorieProgressBarInner").style.width = cals+'%'; }
    if(protein > 100) { document.getElementById("proteinProgressBarInner").style.width = '100%'; } else { document.getElementById("proteinProgressBarInner").style.width = protein+'%'; }
    if(fat > 100) { document.getElementById("fatProgressBarInner").style.width = '100%'; } else { document.getElementById("fatProgressBarInner").style.width = fat+'%'; }
    if(carbs > 100) { document.getElementById("carbsProgressBarInner").style.width = '100%'; } else { document.getElementById("carbsProgressBarInner").style.width = carbs+'%'; }
    
    document.getElementById("runningTotalCalories").innerHTML = runningTotals.calories + "/" + window.localStorage.getItem('currentGoalCalories') + " (" + cals.toFixed(2) + "%)";
    document.getElementById("runningTotalProtein").innerHTML = runningTotals.protein + "/" + window.localStorage.getItem('currentGoalProtein') + " (" + protein.toFixed(2) + "%)";
    document.getElementById("runningTotalFat").innerHTML = runningTotals.fat + "/" + window.localStorage.getItem('currentGoalFat') + " (" + fat.toFixed(2) + "%)";
    document.getElementById("runningTotalCarbs").innerHTML = runningTotals.carbs + "/" + window.localStorage.getItem('currentGoalCarbs') + " (" + carbs.toFixed(2) + "%)";
    
}

function addToRunningTotals(calories, protein, carbs, fat) {
    runningTotals.calories += calories;
    runningTotals.protein += protein;
    runningTotals.carbs += carbs;
    runningTotals.fat += fat;
    refreshRunningTotal();
}

function subtractFromRunningTotals(calories, protein, carbs, fat) {
    runningTotals.calories -= calories;
    runningTotals.protein -= protein;
    runningTotals.carbs -= carbs;
    runningTotals.fat -= fat;
    refreshRunningTotal();
}

function addAllPredefined() {
    let tmpIndex = 0;
    for(let i = 0; i < predefinedFoods.length / 4; i++) {
        tmpIndex++;
        addButtonAndAppend(predefinedFoods[i].name, "predefinedOne");
    }
    
    for(let i = tmpIndex; i < predefinedFoods.length / 2; i++) {
        tmpIndex++;
        addButtonAndAppend(predefinedFoods[i].name, "predefinedTwo");
    }
    
    for(let i = tmpIndex; i < predefinedFoods.length - (predefinedFoods.length/4); i++) {
        tmpIndex++;
        addButtonAndAppend(predefinedFoods[i].name, "predefinedThree");
    }
    
    for(let i = tmpIndex; i < predefinedFoods.length; i++) {
        tmpIndex++;
        addButtonAndAppend(predefinedFoods[i].name, "predefinedFour");
    }
}

function writeToCanvas(item) {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let append = "Name: "+item.name;
    let append1 = "Calories: "+item.calories;
    let append2 = "Protein: "+item.protein+"g";
    let append3 = "Fat: "+item.fat+"g";
    let append4 = "Carbs: "+item.carbs+"g";
    
    let nameOffset = 0;
                 
    ctx.textAlign = "center";
    ctx.font = "18px Arial";
    ctx.fillText(append, canvas.width/2, 40);
    ctx.fillText(append1, canvas.width/2, 70);
    ctx.fillText(append2, canvas.width/2, 100);
    ctx.fillText(append3, canvas.width/2, 130);
    ctx.fillText(append4, canvas.width/2, 160);
}

function listContainsString(name) {
    for (let i = 0; i < tempItems.length; i++) {
        if (tempItems[i].includes(name)) {
            return true;
        }
    }
    return false;
}

function addEnterListeners() {
    var x = document.getElementById("nameInput");
    
    x.addEventListener("keyup", async function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            await addOtherLocal()
        }
    });
    
    var y = document.getElementById("calInput");
    
    y.addEventListener("keyup", async function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            await addOtherLocal()
        }
    });
    
    var yy = document.getElementById("proteinInput");
    
    yy.addEventListener("keyup", async function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            await addOtherLocal()
        }
    });
    
    var xy = document.getElementById("fatInput");
    
    xy.addEventListener("keyup", async function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            await addOtherLocal()
        }
    });
    
    var yyz = document.getElementById("carbInput");
    
    yyz.addEventListener("keyup", async function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            await addOtherLocal()
        }
    });
    
    let input = document.getElementById("searchInput");
    input.addEventListener('input', filterButtons);
}

function playButtonNoise() {
    var audio = document.getElementById("audioSubmitAll");
    audio.play();
}

function pushItemToTempStorageList(food, filteredNames) {
    if(filteredNames === null) {
        let foodItem = {
                name: food.name,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fat: food.fat,
                count: 1,
                isPredefined: false
        };
        
        foodsReceivedFromDatabase.push(foodItem);
    }
    else {
        for(let i = 0; i < filteredNames.length; i++) {
            let matchedItem = predefinedFoods.find(x => x.name === filteredNames[i].name)
            
            let foodItem = {
                name: filteredNames[i].name,
                calories: matchedItem.calories * filteredNames[i].count,
                protein: matchedItem.protein * filteredNames[i].count,
                carbs: matchedItem.carbs * filteredNames[i].count,
                fat: matchedItem.fat * filteredNames[i].count,
                count: filteredNames[i].count,
                isPredefined: true
            }
            
            foodsReceivedFromDatabase.push(foodItem);
            addToRunningTotals(foodItem.calories, foodItem.protein, foodItem.carbs, foodItem.fat);
        }
    }
}

async function pushItemsToDatabase() {
    let itemsToSend = [];
    
    for(let i = 0; i < tempItems.length; i++) {
        let currentItem = predefinedFoods.find(x => x.name === tempItems[i]);
        itemsToSend.push(currentItem);
    }
    
    if(itemsToSend.length !== 0) {
    
        await pushPredefinedItemToDB(itemsToSend);
        
        let filteredNames = [];
        
        for(let i = 0; i < itemsToSend.length; i++) {
            if(!filteredNames.some(x => x.name === itemsToSend[i].name)) {
                filteredNames.push(
                    {
                        name: itemsToSend[i].name,
                        calories: itemsToSend[i].calories,
                        protein: itemsToSend[i].protein,
                        carbs: itemsToSend[i].carbs,
                        fat: itemsToSend[i].fat,
                        count: 1
                    }
                );
            } 
            else {
                let index = filteredNames.findIndex(x => x.name === itemsToSend[i].name);
                filteredNames[index].calories += itemsToSend[i].calories;
                filteredNames[index].protein += itemsToSend[i].protein;
                filteredNames[index].carbs += itemsToSend[i].carbs;
                filteredNames[index].fat += itemsToSend[i].fat;
                filteredNames[index].count += 1;
            }
        }
        
        for(let i = 0; i < filteredNames.length; i++) {
            console.log(foodsReceivedFromDatabase);
            let match = foodsReceivedFromDatabase.find(x => x.name === filteredNames[i].name);
            let index = foodsReceivedFromDatabase.findIndex(x => x.name === filteredNames[i].name);
            
            if(match) {
            
                console.log("Found a match, appending stuff")
                let appendedItem = {
                    name: match.name,
                    calories: match.calories + filteredNames[i].calories,
                    protein: match.protein + filteredNames[i].protein,
                    carbs: match.carbs + filteredNames[i].carbs,
                    fat: match.fat + filteredNames[i].fat,
                    count: match.count + filteredNames[i].count
                };
            
               let x = document.getElementById(match.name+"ListItem").innerHTML =
                    appendedItem.name + ": "+appendedItem.count+
                    "<br><br/>Calories: "+appendedItem.calories+
                    "<br/>Protein: "+appendedItem.protein+
                    "g<br/>Fat: "+appendedItem.fat+
                    "g<br/>Carbs: "+appendedItem.carbs +"g";
                    console.log(x);
                    
                foodsReceivedFromDatabase[index] = appendedItem;
                console.log(foodsReceivedFromDatabase);
            }
            else {
                 console.log("New stuff, add to list");
                let appendedItem = {
                    name: filteredNames[i].name,
                    calories: filteredNames[i].calories,
                    protein: filteredNames[i].protein,
                    carbs: filteredNames[i].carbs,
                    fat: filteredNames[i].fat,
                    count: filteredNames[i].count,
                    isPredefined: true
                };
                
                foodsReceivedFromDatabase.push(appendedItem);
                
                appendItemToListWithDeleteButton(appendedItem.name);
            }
        
        }
        
        let x = document.createElement("img");
            x.src = "Formats/Resources/success.png";
            x.style.position = 'relative';
            x.style.left = '12%';
            x.style.bottom = '10%';
        
        if(!document.getElementById("fadingSuccess").hasChildNodes()) {
            document.getElementById("fadingSuccess").appendChild(x);
        }
        else {
            document.getElementById("fadingSuccess").removeChild(document.getElementById("fadingSuccess").firstChild);
            setTimeout(function () {
                document.getElementById("fadingSuccess").appendChild(x);
            }, 50);
        }
        
        playButtonNoise();
        
        for(let i = 0; i < tempItems.length; i++) {
            document.getElementById(tempItems[i]+"Btn").innerHTML = tempItems[i]+"<br />0";
            let x = predefinedFoods.find(s => s.name === tempItems[i]);
            x.count = 0;
        }
        
        tempItems = [];
        
    }
    else {
        document.getElementById("fadingSuccess").style.wordWrap = 'break-word'
        document.getElementById("fadingSuccess").innerHTML = "Select at least 1 item before submitting";
        document.getElementById("fadingSuccess").style.top = '20%';
    }
}

async function getOtherTotalsAndAppend() {
    let res = await getOtherMealsFromDB();

    for(let i = 0; i < res.length; i++) {
        
        let food = {
            name: res[i].name,
            calories: res[i].calories,
            protein: res[i].protein,
            carbs: res[i].carbs,
            fat: res[i].fat,
            count: 1,
            isPredefined: false
        };
        
        addToRunningTotals(food.calories, food.protein, food.carbs, food.fat)
        
        pushItemToTempStorageList(food, null);
        appendItemToListWithDeleteButton(food.name, false);
    }
}

async function getPredefinedTotalsAndAppend() {
    let res = await getPredefinedMealsFromDB();

    let filteredNames = [];

    for(let i = 0; i < res.length; i++) {
        if(!filteredNames.some(x => x.name === res[i].name)) {
            filteredNames.push({
                name: res[i].name,
                count: 1
            });
        } 
        else {
            let index = filteredNames.findIndex(x => x.name === res[i].name);
            filteredNames[index].count += 1;
        }
    }
    
    pushItemToTempStorageList(null, filteredNames);
    
    for(let i = 0; i < filteredNames.length; i++) {
        appendItemToListWithDeleteButton(filteredNames[i].name,true); 
    }
}

async function getItemsInList() {
    let res = await getPredefinedItemListFromDB();
        
        
    for(let i = 0; i < res.length; i++) {
        let food = {name:res[i].name, calories:res[i].calories, protein:res[i].protein, carbs:res[i].carbs, fat:res[i].fat, count:0}
        predefinedFoods.push(food);    
    }
}

async function addOther() {
    let food = validateUserInput();
    
    if(food.name.length > 0 && (food.calories > 0 || food.protein > 0 || food.carbs > 0 || food.fat > 0)) {
        await addNewItemToDB(food);
        playButtonNoise();
        window.location.reload();
    } 
    else {
        let x = document.createElement("p")
            x.style.fontSize = '22px';
            x.innerHTML = "Entry needs <br/>a valid name<br/>& 1 non-zero<br/>macro";
        
        if(!document.getElementById("errorMessageAppend").hasChildNodes()) {
            document.getElementById("errorMessageAppend").appendChild(x);
        } 
        else {
            document.getElementById("errorMessageAppend").replaceChild(x, document.getElementById("errorMessageAppend").childNodes[0]);
        }
    }
}

async function addOtherLocal() {
    let food = validateUserInput();
    
    addToRunningTotals(cal, pro, carb, fat);

    if(food.name.length > 0 && (food.calories > 0 || food.protein > 0 || food.carbs > 0 || food.fat > 0)) {

        await pushOtherItemToDB(food);
        
        playButtonNoise();
        appendItemToListWithDeleteButton(food);

        document.getElementById("nameInput").value = '';
        document.getElementById("calInput").value = '';
        document.getElementById("proteinInput").value = '';
        document.getElementById("carbInput").value = '';
        document.getElementById("fatInput").value = '';
    
    } 
    else {
        let x = document.createElement("p")
            x.style.fontSize = '22px';
            x.innerHTML = "Entry needs <br/>a valid name<br/>& 1 non-zero<br/>macro";
        
        if(!document.getElementById("errorMessageAppend").hasChildNodes()) {
            document.getElementById("errorMessageAppend").appendChild(x);
        } 
        else {
            document.getElementById("errorMessageAppend").replaceChild(x, document.getElementById("errorMessageAppend").childNodes[0]);
        }
    }
}
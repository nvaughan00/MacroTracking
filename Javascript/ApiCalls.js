let urlBase = 'http://ec2-3-16-166-251.us-east-2.compute.amazonaws.com:3000';

let username = window.localStorage.getItem('currentUsername')

let date = new Date();
let currentDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();

async function getOtherMealsFromDB() {
let url = urlBase+'/'+username+'/'+currentDate+'/mealOther';

    let res = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(err => console.log(err));
    
    return res;
}

async function getPredefinedMealsFromDB() {
    let url = urlBase+'/'+username+'/'+currentDate+'/mealPredefined';

    let res = await fetch(url, {
        method: 'GET', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(err => console.log(err));
        
    return res;
}

async function getPredefinedItemListFromDB() {
    let url = urlBase+'/getAllItems';

    let res = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(err => console.log(err)); 
    
    return res;
}

async function pushOtherItemToDB(food) {
    let url = urlBase+'/'+username+'/'+currentDate+'/'+'addMealOther';
    
     fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                name: food.name,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fat: food.fat
            }
        )
    })
    .catch(err => console.log(err));
}

async function pushPredefinedItemToDB(itemsToSend) {
    let url = urlBase+'/'+username+'/'+currentDate+'/'+'addMealPredefined';
     
    await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemsToSend)
    })
    .catch(err => console.log(err));
}

async function addNewItemToDB(food) {
    let url = urlBase+'/addItem';
    
    await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                name: food.name,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fat: food.fat
            }
        )
    })
    .catch(err => console.log(err));
}

async function getGoalSingle() {
    let url = urlBase+'/'+username+'/'+'getGoal';
    
    let res = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(err => console.log(err));
    
    return res;
}

async function deleteItem(name, isPredefined) {
    let url = urlBase+'/'+username+'/'+currentDate+'/';
    
    if(isPredefined) {
        url += 'deleteItemPredefined'
    }
    else {
        url += 'deleteItemOther'
    }
    
    await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                name: name,
            }
        )
    })
    .catch(err => alert(err));
}
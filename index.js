const sql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const helmet = require('helmet');
require("babel-core").transform("code", {
  presets: ["es2015"]
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    next();
});

app.options('*', function(req, res) {
    res.send(200);
});

server.listen(8080, (err) => {
    if (err) {
        throw err;
    }
    console.log('Node Endpoints working :)');
});

module.exports = server;

var con = sql.createConnection({
    host:'localhost',
	port: 3306,
    user:'root',
    password:'Rats1423',
    database:'workouts_info'
});
con.connect();

app.get('/:username/:date/mealOther', async function(req, res) {
	var username = req.params.username
	var date = req.params.date
	
	con.query('SELECT id FROM user_info WHERE username = ?', username, async function(err, data, fields) {
		console.log("GETTING MEAL INFO: id = "+data[0].id);

		con.query('SELECT id FROM user_meal WHERE userId = ? AND mealDate = ?', [data[0].id, date], (err, rows, fields) => {
			var mealId;
			if(rows[0] === undefined) { mealId = -1; console.log("couldn't find that date")}
			else {
				console.log("MealId is: "+rows[0].id);
				mealId = rows[0].id;
			}
			con.query('SELECT name, calories, protein, fat, carbs FROM user_meal_other_stat WHERE mealId = ?', mealId, async function(err, cols, fields) {
				if(err) { 
					res.status(400).send({
						"message":"No workouts found"
					}).end();
				}
				else {
					console.log("First:"+ cols[0]);
					var sendData = [];
					for(var i = 0; i < cols.length; i++) {
						sendData[i] = ({
							"name": cols[i].name,
							"calories": cols[i].calories,
							"protein": cols[i].protein,
							"fat": cols[i].fat,
							"carbs": cols[i].carbs
						})
					}
					console.log("Data: "+sendData);
					res.status(200).send(sendData).end();
				}
			});
		});
	});
});

app.post('/:username/:date/addMealOther', (req, res) => {
	var username = req.params.username;
	var date = req.params.date;
	
	var name = req.body.name;
	var calories = req.body.calories;
	var protein = req.body.protein;
	var carbs = req.body.carbs;
	var fat = req.body.fat;
	
	con.query('SELECT id FROM user_info WHERE username = ?', username, async function(err, data, fields) {
	
		con.query('INSERT INTO user_meal(userId, mealDate) VALUES(?, ?)', [data[0].id, date], function(err, data, fields) {
			if (err) {
				console.log("Date already exists, not creating another entry\n");
			}
		});
		
		con.query('SELECT id FROM user_meal WHERE userId = ? AND mealDate = ?', [data[0].id, date], function(err, rows, fields) {
			console.log("Posting, mealId is: "+rows[0].id);
			
			con.query('INSERT INTO user_meal_other_stat(mealId, name, calories, protein, fat, carbs) VALUES(?, ?, ?, ?, ?, ?)', [rows[0].id, name, calories, protein, fat, carbs], function(err, data) {
				if (err) {
					res.status(400).send({
						"message": "Failure"
					}).end();
				}
				else {
					res.status(200).send({
						"message": "Success"
					}).end();
				}
			});
		});
	});
});

app.get('/tryLogin', (req, res) => {
    var username = req.body.username;
    var pass = req.body.password;

    con.query('SELECT * FROM USER_INFO WHERE username = ? AND password = ?', [username, pass], function(err, data, fields) {
        if(!data.length) {
            res.status(400).send( {
                "message":"failure"
            }).end();
        }
        else {
            res.status(200).send( {
                "message":"success",
				"email": username
            }).end();
        }
    });
});
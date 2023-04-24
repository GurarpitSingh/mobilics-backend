const express = require('express');
const app = express();
require('./db/connection');
const cors = require('cors');

const User = require('./models/users');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post('/createUser', (req, res) => {
    console.log('object');
    try {
        const user = new User(req.body);
        user.save();
        res.status(200).json(user)
        
    } catch (error) {
        res.json(error)
    }
});

app.get('/users:id/page:page/limit:limit', async (req, res) => {
    console.log(req.params.id);
    console.log(req.params.page);
    console.log(req.params.limit);


    var queryId = req.params.id;
    var page = Number(req.params.page) || 1
    var limit = Number(req.params.limit) || 5

    var skip = (page - 1) * limit
    var users = ''


    if(queryId === '0'){
    users = await User.find({
        income: { $lt: '$5' },
        car: { $in: ['BMW', 'Mercedes'] }
      }).skip(skip).limit(limit)
    } 
    
    
    else if(queryId === '1'){
        users = await User.find({
            gender: 'Male',
            $expr: { $gt: [ { $toDouble: "$phone_price" }, 10000 ] }
          }
        ).skip(skip).limit(limit)
    }


    else if(queryId === '2'){
        users = await User.find({
            last_name: { $regex: /^M/i },
            $expr: {
                $gt: [ { $strLenCP: '$quote' }, 15 ]
              },
            email: { $regex: /M$/i }
          }).skip(skip).limit(limit)
        }


    else if(queryId === '3'){
        users = await User.find({
            car: { $in: ['BMW', 'Mercedes', 'Audi'] },
            email: { $not: { $regex: /\d/ } }
          }).skip(skip).limit(limit)
        }

        else if(queryId === '4'){
            users = await User.aggregate([
                {
                  $group: {
                    _id: '$city',
                    count: { $sum: 1 },
                    total_income: { $sum: { $toDouble: { $substr: ['$income', 1, -1] } } },
                  }
                },
                {
                  $sort: { count: -1 }
                },
                {
                  $limit: 10
                },
                {
                  $project: {
                    _id: 0,
                    city: '$_id',
                    count: 1,
                    avg_income: { $divide: ['$total_income', '$count'] },
                  }
                }
              ])
            }


      users ? res.status(200).json(users) : res.status(404).json({ message: 'No users found' })

    
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});





app.listen(3001, () => {
    console.log('Server listening on port 3001');
    }
);
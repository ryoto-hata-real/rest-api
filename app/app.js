const express = require('express')
const app = express()

const sqlite3 = require('sqlite3')
const dbPath = "app/db/database.sqlite3"

// Build WEB Server
const path = require('path')
    // set static root directory
app.use(express.static(path.join(__dirname, 'public')))

// read request
const bodyParser = require('body-parser')
    // Setting:Parse Request-Body 
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// Get all users
app.get('/api/v1/users',(req, res) => {
    const db = new sqlite3.Database(dbPath)

    db.all('SELECT * FROM users;', (err, rows) => {
        res.json(rows)
    })

    db.close()
})

// Get a user
app.get('/api/v1/users/:id',(req, res) => {
    const db = new sqlite3.Database(dbPath)
    const id = req.params.id

    db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
        res.json(row)
    })

    db.close()
})


app.get('/api/v1/search', (req, res) => {
    // Connect database
    const db = new sqlite3.Database(dbPath)
    const keyword = req.query.q
  
    db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
      res.json(rows)
    })
  
    db.close()
  })

// Create a new User
app.post('/api/v1/users', async (req, res) => {
    const db = new sqlite3.Database(dbPath)

    const name = req.body.name
    const profile = req.body.profile ? req.body.profile : ""
    const date_of_birth = req.body.date_of_birth ? req.body.date_of_birth : ""

    

    await run(`INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${date_of_birth}")`, db, res, "新規ユーザを作成しました。")
    .then((code) => { console.log("normal:" + code); })
    .catch((code) => { console.error("error:" + code); })
    db.close()
})

// Update a new User
app.put('/api/v1/users/:id', async (req, res) => {
    const db = new sqlite3.Database(dbPath)
    const id = req.params.id

    db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
        const name = req.body.name ? req.body.name : row.name
        const profile = req.body.profile ? req.body.profile : row.profile
        const date_of_birth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth
    })

    await run(`UPDATE users SET name="${name}", profile="${profile}", date_of_birth=${date_of_birth}" WHERE id = ${id}`,
    db,
    res,
     "ユーザー情報を更新しました。")
    db.close()
})

app.delete('/api/v1/users/:id', async (req, res) => {
    const db = new sqlite3.Database(dbPath)
    const id = req.params.id

    await run(`DELETE FROM users WHERE id = ${id}`,
    db,
    res,
     "ユーザー情報を削除しました。")
    db.close()
})

const run = async (sql, db, res, message) =>{
    return new Promise((resolve, reject) =>{
        db.run(sql, (err) =>{
            if(err){
                res.status(500).send(err)
                return reject()
            }else{
                res.json({message:message})
                return resolve()
            }
        })
    })
}


const port = process.env.PORT || 3000;
app.listen(port)
console.log("Listen on port : " + port)



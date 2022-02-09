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
        if(!row){
            res.status(404).json({status:404,error:"Not Found"})
        }else{
            res.status(200).json(row)
        }
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
    if(!req.body.name || req.body.name === ""){
        res.status(400).json({status:400,error:"UserName is not set"})
    }else{

        const db = new sqlite3.Database(dbPath)

        const name = req.body.name
        const profile = req.body.profile ? req.body.profile : ""
        const date_of_birth = req.body.date_of_birth ? req.body.date_of_birth : ""

        
        try {
            await run(`INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${date_of_birth}")`, db)
            res.status(201).json({status:201, message:"ユーザーを新規登録しました。"})
        } catch (e){
            res.status(500).json({status:500, error:e})
        }
        db.close()
    }
})

// Update a new User
app.put('/api/v1/users/:id', async (req, res) => {
    if(!req.body.name || req.body.name === ""){
        res.status(400).json({status:400,error:"UserName is not set"})
    }else{
        const db = new sqlite3.Database(dbPath)
        const id = req.params.id

        db.get(`SELECT * FROM users WHERE id = ${id}`, async (err, row) => {
            if(!row){
                res.status(404).json({status:404,error:"Not Found"})
            }else{
                const name = req.body.name ? req.body.name : row.name
                const profile = req.body.profile ? req.body.profile : row.profile
                const date_of_birth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth
                try {
                    await run(`UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${date_of_birth}" WHERE id = ${id}`,db)
                    res.status(200).json({status:200, message:"ユーザー情報を変更しました。"})
                } catch (e){
                    res.status(500).json({status:500, error:e})
                }
            
            }
        })
        db.close()
    }
})

app.delete('/api/v1/users/:id', async (req, res) => {
    const db = new sqlite3.Database(dbPath)
    const id = req.params.id

    try {
        await run(`DELETE FROM users WHERE id = ${id}`,db)
        res.status(200).json({status:200, message:"ユーザー情報を削除しました。"})
    } catch (e){
        res.status(500).json({status:500, error:e})
    }
    
    db.close()
})

const run = async (sql, db) =>{
    return new Promise((resolve, reject) =>{
        db.run(sql, (err) =>{
            if(err){
                return reject(err)
            }else{
                return resolve()
            }
        })
    })
}

// get following user list
app.get('/api/v1/users/:id/following',(req, res) => {
    const db = new sqlite3.Database(dbPath)
    const id = req.params.id

    db.all(`SELECT * FROM following f LEFT JOIN users u ON f.followed_id = u.id WHERE f.following_id = ${id};`, (err, rows) => {
        if(!rows){
            res.status(404).json({status:404,error:"Not Found"})
        }else{
            res.json(rows)
        }
        
    })

    db.close()
})

// get followed user list
app.get('/api/v1/users/:id/followed',(req, res) => {
    const db = new sqlite3.Database(dbPath)
    const id = req.params.id

    db.all(`SELECT * FROM following f LEFT JOIN users u ON f.following_id = u.id WHERE f.followed_id = ${id};`, (err, rows) => {
        if(!rows){
            res.status(404).json({status:404,error:"Not Found"})
        }else{
            res.json(rows)
        }
        
    })

    db.close()
})

// Follow a new User
app.post('/api/v1/users/:following_id/follow/:followed_id', async (req, res) => {

    const db = new sqlite3.Database(dbPath)
    const following_id = req.params.following_id
    const followed_id = req.params.followed_id

    
    try {
        await run(`INSERT INTO following (following_id, followed_id) VALUES ("${following_id}", "${followed_id}")`, db)
        res.status(201).json({status:201, message:"フォロー成功"})
    } catch (e){
        res.status(500).json({status:500, error:e})
    }
    db.close()
})

// UnFollow a new User
app.delete('/api/v1/users/:following_id/unfollow/:followed_id', async (req, res) => {

    const db = new sqlite3.Database(dbPath)
    const following_id = req.params.following_id
    const followed_id = req.params.followed_id

    try {
        await run(`DELETE FROM following WHERE following_id=${following_id} AND followed_id=${followed_id}`, db)
        res.status(201).json({status:201, message:"フォロー解除"})
    } catch (e){
        res.status(500).json({status:500, error:e})
    }
    db.close()
})
const port = process.env.PORT || 3000;
app.listen(port)
console.log("Listen on port : " + port)



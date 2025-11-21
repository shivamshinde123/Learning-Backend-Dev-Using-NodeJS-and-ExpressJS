
import db from '../db.js'
import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Register new user endpoint /auth/register
router.post('/register', (req, res) => {
    const { username, password } = req.body
    // save the username and irreversibly encrypted passoword to the db
    // these encryptions are one way i.e., once encrypted, we cannot decrypt it.

    // encrypt the password
    const hashed_password = bcrypt.hashSync(password, 8)

    // save the new user and hashed password to db
    try {
        const insertUser = db.prepare(`
            INSERT INTO users (username, password)
            VALUES (?, ?)`)

        const result = insertUser.run(username, hashed_password)

        // now that we have a user, I want to add their first todo for them
        const defaultTodo = `Hello:) Add you first todo!`
        const insertTodo = db.prepare(`
            INSERT INTO todos (user_id, task)
            VALUES (?, ?)`)

        insertTodo.run(result.lastInsertRowid, defaultTodo)

        // create a token
        // note that here we are using the id for the user
        // it will later used in the middleware 
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })
        // This token is then sent to the user. Once the user receives this token, it is saved to user's localStorage. 
        // Now, whenever, user wants all the todos, he will send a request to /todos route with the token in the header.
        // with this token, we will recognize the user and this way user doesn't have to login again and again just to see new todos 
        res.json({ token })

    }
    catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

})

router.post('/login', (req, res) => {
    const { username, password } = req.body
    // we get the the passoword associated with the user entered username in the database, 
    // but we get it back and see its encrypted, which mean we cannot compare it to the one the user is using 
    // for login. so what we can do is again one way encrypt the password the user just entered.
    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')

        const user = getUser.get(username)

        console.log(user)

        // if we can't find a user associated with that username, return out of the function
        if (!user) {
            return res.status(404).send({ message: "User not found" })
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)

        // if the password doesn't match, return out of the function
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid Password" })
        }

        // now we have successful authentication
        // note that here we are using the id for the user
        // it will later used in the middleware 
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })

    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router


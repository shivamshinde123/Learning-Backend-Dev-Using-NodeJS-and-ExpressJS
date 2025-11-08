
import db from '../db.js'
import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/register', async (req, res) => {
    const { username, password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await db('users').insert({
            username,
            password: hashedPassword
        })

        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' })
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await db('users').where({ username }).first()

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' })
    }
})

export default router
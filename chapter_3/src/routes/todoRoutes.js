

import db from '../db.js'
import express from 'express'

const router = express.Router()

// get all todos for logged-in users
router.get('/', (req, res) => {})

// create a todo
router.post('/', (req, res) => {})

// update a todo
router.put('/:id', (req, res) => {})

// delete a todo
router.delete('/:id', (req, res) => {})

export default router
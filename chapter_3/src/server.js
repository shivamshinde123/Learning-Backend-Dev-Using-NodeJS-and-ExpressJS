import express from 'express'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'

const app = express()

const PORT = process.env.PORT || 3000;

// Get the filepath from the URL of the current module
const __filename = fileURLToPath(import.meta.url);
// console.log(__filename);

// Get the directory name from the file path
const __dirname = dirname(__filename);
// console.log(__dirname);


// Middleware
app.use(express.json())

// serves the HTML file from the /public directory
// Tells express to serve all the files form the public folder as static assets file.
// Any request for the css files will be resolved to the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serving up the HTML file from the public folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

// routes
app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


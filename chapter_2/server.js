
// The address of this server connected to this network is: 
// URL --> http://localhost:8383
// IP --> 127.0.0.1:8383

const express = require("express");

const app = express();

const PORT = 8383;

let data = ['James']

// Middleware
app.use(express.json())

// HTTP Verbs (or methods)
// GET --> Read
// POST --> Create
// PUT --> Update
// DELETE --> Delete

// The method informs the nature of request and the route is a further 
// subdirectory (basically we direct the request to the body of code to respond appropriately,
// and these locations or routes are called endpoint)

// Type 1- website endpoints
app.get("/", (req, res) => {
    // this is endpoint number 1 
    res.send(`
        <body style="background:pink; color:blue;">
        <h1>Data</h1>
            <p>${JSON.stringify(data)}</p>
            <a href="/dashboard">Dashboard</a>
        </body>
        `)
})

app.get('/dashboard', (req, res) => {
    // this is endpiont number 2
    res.send(`
        <body>
        <h1>Dashboard</h1>
        <a href="/">Home</a>
        </body>`
    )
})

// website endpoints  (these endpoints are for sending back the html and they typically when a user enters a url in a browser)

// API Endpoints ()

app.get('/api/data', (req, res) => {
    console.log("This one is for data")
    res.send(data)
})

app.post('/api/data', (req, res) => {
    // someone wants to create a users (for example when they click on sign up button)
    // the user clicks sign up button after entering their credentials, and their browser is wired up to send our a network request to the server to handle that action
    const newEntry = req.body  
    console.log(newEntry)
    data.push(newEntry.name)
    res.sendStatus(201) // created
})

app.delete('/api/data', (req, res) => {
    data.pop()
    console.log("We deleted the element of the end of the array")
    res.sendStatus(204)
})

app.listen(PORT, () => {
    console.log(`Server has started on: ${PORT}`)
})




import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']

    if (!token) {
        return res.status(401).send({message: "No token provided"})
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err){
            return res.status(401).send({message: "Invalid token"})
        }

        // modifying the request to include the decoded id of the verified user
        req.userId = decoded.id

        // user passed the checkpoint, now the request will go to the server
        next()

    })
}

export default authMiddleware
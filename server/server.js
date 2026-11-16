require('dotenv').config()
const express = require('express')
const cors = require('cors')

const courseRoutes = require('./routes/courses')
const completionRoutes = require('./routes/completions')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: process.env.CLIENT_ORIGIN }))
app.use(express.json())

app.use('/api', courseRoutes)
app.use('/api', completionRoutes)

// Bad JSON in a request body returns a JSON 400 instead of an HTML error page
app.use((err, req, res, _next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Request body is not valid JSON' })
    }
    res.status(500).json({ error: err.message })
})

app.listen(PORT, () => {
    console.log(`Course Scheduler API running on http://localhost:${PORT}`)
})

const express = require('express')
const pool = require('../util/database')
const { getCoursesWithPrereqs, replaceCompletions } = require('../util/courseData')

const USER_ID = 1 // M3: replaced by the logged-in user's id

const router = express.Router()

// Every completed course must have all of its prerequisites in the completed array.
const isValidCompletionSet = (courses, completed) => {
    return completed.every(id => {
        const course = courses.find(c => c.id === id)
        return course && course.prerequisites.every(p => completed.includes(p))
    })
}

async function getCompletedIds() {
    const [rows] = await pool.query(
        'SELECT course_id FROM completions WHERE user_id = ? ORDER BY course_id',
        [USER_ID]
    )
    return rows.map(r => r.course_id)
}

// GET /api/completions
router.get('/completions', async (req, res) => {
    try {
        res.json(await getCompletedIds())
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PUT /api/completions
router.put('/completions', async (req, res) => {
    const completed = req.body
    if (!Array.isArray(completed) || !completed.every(Number.isInteger)) {
        return res.status(400).json({ error: 'Body must be an array of course ids' })
    }
    const uniqueIds = [...new Set(completed)]

    try {
        // Never trust the client: check prerequisites before saving anything
        const courses = await getCoursesWithPrereqs(pool)
        if (!isValidCompletionSet(courses, uniqueIds)) {
            return res.status(400).json({
                error: 'Invalid completions: every completed course must exist and have all of its prerequisites completed',
            })
        }

        await replaceCompletions(pool, USER_ID, uniqueIds)
        res.json(await getCompletedIds())
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router

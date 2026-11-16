const express = require('express')
const pool = require('../util/database')
const { getCoursesWithPrereqs } = require('../util/courseData')
const validateCourse = require('../util/validateCourse')

const router = express.Router()

// Returns an error message if any prerequisite id is not a real course (or is the course itself).
async function checkPrereqIds(prereqIds, courseId) {
    if (prereqIds.length === 0) return null
    if (courseId !== undefined && prereqIds.includes(courseId)) {
        return 'A course cannot be its own prerequisite'
    }
    const [rows] = await pool.query('SELECT id FROM courses WHERE id IN (?)', [prereqIds])
    const found = rows.map(r => r.id)
    const missing = prereqIds.filter(id => !found.includes(id))
    if (missing.length > 0) {
        return `Prerequisite course id(s) not found: ${missing.join(', ')}`
    }
    return null
}

async function insertPrereqs(courseId, prereqIds) {
    if (prereqIds.length === 0) return
    const rows = prereqIds.map(prereqId => [courseId, prereqId])
    await pool.query('INSERT INTO prerequisites (course_id, prereq_id) VALUES ?', [rows])
}

// GET /api/courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await getCoursesWithPrereqs(pool)
        res.json(courses)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/courses/:id
router.get('/courses/:id', async (req, res) => {
    try {
        const course = await getCoursesWithPrereqs(pool, req.params.id)
        if (!course) return res.status(404).json({ error: 'Course not found' })
        res.json(course)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST /api/courses
router.post('/courses', async (req, res) => {
    const error = validateCourse(req.body)
    if (error) return res.status(400).json({ error })

    const { number, title, credits, description = null } = req.body
    const prereqIds = [...new Set(req.body.prerequisites || [])]

    try {
        const prereqError = await checkPrereqIds(prereqIds)
        if (prereqError) return res.status(400).json({ error: prereqError })

        const [result] = await pool.query(
            'INSERT INTO courses (number, title, credits, description) VALUES (?, ?, ?, ?)',
            [number.trim(), title.trim(), credits, description]
        )
        await insertPrereqs(result.insertId, prereqIds)

        const course = await getCoursesWithPrereqs(pool, result.insertId)
        res.status(201).json(course)
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: `Course number ${number} already exists` })
        }
        res.status(500).json({ error: err.message })
    }
})

// PUT /api/courses/:id
router.put('/courses/:id', async (req, res) => {
    const error = validateCourse(req.body)
    if (error) return res.status(400).json({ error })

    const id = Number(req.params.id)
    const { number, title, credits, description = null } = req.body
    const prereqIds = [...new Set(req.body.prerequisites || [])]

    try {
        const prereqError = await checkPrereqIds(prereqIds, id)
        if (prereqError) return res.status(400).json({ error: prereqError })

        const [result] = await pool.query(
            'UPDATE courses SET number = ?, title = ?, credits = ?, description = ? WHERE id = ?',
            [number.trim(), title.trim(), credits, description, id]
        )
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found' })
        }

        await pool.query('DELETE FROM prerequisites WHERE course_id = ?', [id])
        await insertPrereqs(id, prereqIds)

        const course = await getCoursesWithPrereqs(pool, id)
        res.json(course)
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: `Course number ${number} already exists` })
        }
        res.status(500).json({ error: err.message })
    }
})

// DELETE /api/courses/:id
router.delete('/courses/:id', async (req, res) => {
    try {
        const course = await getCoursesWithPrereqs(pool, req.params.id)
        if (!course) return res.status(404).json({ error: 'Course not found' })

        // ON DELETE CASCADE removes its prerequisite and completion rows
        await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id])
        res.json(course)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router

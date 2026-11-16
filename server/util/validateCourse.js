// Shared validation for POST and PUT /api/courses.
// Returns an error message string, or null if the body is valid.
function validateCourse(body) {
    const { number, title, credits, prerequisites } = body || {}

    if (!number || !title || credits === undefined || credits === null || credits === '') {
        return 'number, title, and credits are required'
    }
    if (typeof number !== 'string' || number.trim().length > 10) {
        return 'number must be a string of at most 10 characters'
    }
    if (typeof title !== 'string' || title.trim().length > 100) {
        return 'title must be a string of at most 100 characters'
    }
    if (!Number.isInteger(Number(credits)) || Number(credits) < 0) {
        return 'credits must be a whole number'
    }
    if (prerequisites !== undefined) {
        if (!Array.isArray(prerequisites) || !prerequisites.every(Number.isInteger)) {
            return 'prerequisites must be an array of course ids'
        }
    }
    return null
}

module.exports = validateCourse

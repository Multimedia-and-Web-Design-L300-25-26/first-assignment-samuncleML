import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express, { response } from 'express'

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filepath = path.join(__dirname, "data.json");
const data = JSON.parse(fs.readFileSync(filepath, "utf-8"));

const PORT = 3000
app.listen(PORT, (request) => {
    console.log(`listening on port ${PORT}`)
})

app.get('/api/students', (request, response) => {
    response.json({
        student: data.students
    })
})
//map filter find

app.get('/api/students/:id', (req, res) => {
    const searchId_s = Number(req.params.id)

    const student = data.students.find(s => s.id===searchId_s)
    res.json({
        id: student.id
    })
})

app.get('/api/instructors', (req, res) => {
    res.json({
        instructor: data.instructors
    })
})

app.get('/api/instructors/:id', (req, res) => {
    const searchId_i = Number(req.params.id)

    const instructor = data.instructors.find(i => i.id===searchId_i)
    res.json({
        id: instructor.id
    })
})

app.get('/api/courses', (req, res) => {
    res.json({
        courses : data.courses
    })
})

app.get('/api/courses/:id', (req, res) => {
    const searchId_c = Number(req.params.id)

    const course = data.courses.find(c => c.id ===searchId_c)
    res.json({
        id: course.id
    })
})

app.get('/api/enrollments', (req, res) => {
    res.json({
        enrollment: data.enrollments
    })
})

app.get('/api/enrollments/:id', (req, res) => {
    const searchId_e = Number(req.params.id)

    const enrollment = data.enrollments.find(e => e.id===searchId_e)
    res.json({
        id: enrollment.id
    })
})

app.get('/api/assignments', (req, res) => {
    res.json({
        assignment: data.assignments
    })
})

app.get('/api/assignments/:id', (req, res) => {
    const searchId_a = Number(req.params.id)

    const assignment = data.assignments.find(a => a.id===searchId_a)
    res.json({
        id: assignment.id
    })
})

app.get('/api/grades', (req, res) => {
    res.json({
        grade: data.grades
    })
})

app.get('/api/grades/:id', (req, res) => {
    const searchId_g = Number(req.params.id)

    const grade = data.grades.find(a => a.id===searchId_g)
    res.json({
        id: grade.id
    })
})


//LEVEL 2

app.get('/api/students/:id/enrollments', (req, res) => {
    const search = Number(req.params.id)
    const studentEnrollments = data.enrollments.filter(a => a.studentId === search)
    const enrollmentIds = studentEnrollments.map(en => en.id)
    res.json({
        enrolmentIds: enrollmentIds
    })
})

app.get('/api/students/:id/courses', (req, res) => {
    const search = Number(req.params.id)
    const studentCourses = data.enrollments.filter(a => a.studentId === search)
    const courseIds = studentCourses.map(en => en.courseId)
    res.json({
        courseIds: courseIds
    })
})

app.get('/api/courses/:id/students', (req, res) => {
    const search = Number(req.params.id)
    const courseEnrollments = data.enrollments.filter(a => a.courseId === search)
    const studentIds = courseEnrollments.map(en => en.studentId)
    res.json({
        studentIds: studentIds
    })
})

app.get('/api/instructors/:id/courses', (req, res) => {
    const search = Number(req.params.id)
    const instructorCourses = data.courses.filter(a => a.instructorId === search)
    const courseIds = instructorCourses.map(c => c.id)
    res.json({
        courseIds: courseIds
    })
})

app.get('/api/courses/:id/assignments', (req, res) => {
    const search = Number(req.params.id)
    const courseAssignments = (data.assignments || []).filter(a => a.courseId === search)
    const assignmentIds = courseAssignments.map(a => a.id)
    res.json({
        assignmentIds: assignmentIds
    })
})

app.get('/api/enrollments/:id/grades', (req, res) => {
    const search = Number(req.params.id)
    const enrollment = data.enrollments.find(a => a.id === search)
    res.json({
        grade: enrollment?.grade || null
    })
})

//LEVEL 3

app.get('/api/students/:id/gpa', (req, res) => {
    const search = Number(req.params.id)
    const student = data.students.find(a => a.id === search)
    res.json({
        gpa: student?.gpa || null
    })
})

app.get('/api/courses/:id/average', (req, res) => {
    const search = Number(req.params.id)
    const courseEnrollments = data.enrollments.filter(a => a.courseId === search && a.grade)
    
    const gradePoints = { 'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'E':0.5, 'F':0.0 }
    const total = courseEnrollments.reduce((acc, en) => acc + (gradePoints[en.grade] || 0), 0)
    const average = courseEnrollments.length ? (total / courseEnrollments.length).toFixed(2) : 0

    res.json({
        averageGrade: Number(average)
    })
})

app.get('/api/instructors/:id/students', (req, res) => {
    const search = Number(req.params.id)
    const instructorCourses = data.courses.filter(a => a.instructorId === search).map(c => c.id)
    const studentIds = data.enrollments
        .filter(a => instructorCourses.includes(a.courseId))
        .map(en => en.studentId)
    
    res.json({
        studentIds: [...new Set(studentIds)]
    })
})

app.get('/api/students/:id/schedule', (req, res) => {
    const search = Number(req.params.id)
    const studentCourses = data.enrollments
        .filter(a => a.studentId === search && a.status === 'enrolled')
        .map(en => en.courseId)
    
    const schedule = data.courses
        .filter(a => studentCourses.includes(a.id))
        .map(c => ({ course: c.name, schedule: c.schedule }))

    res.json({
        schedule: schedule
    })
})
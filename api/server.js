
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()


const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("database connected"))
    .catch(console.error)

const Todo = require('./models/task')

app.get('/todos', async (req, res) => {
    const todos = await Todo.find()
    res.json(todos)
})
app.post('/todo/new', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    })
    todo.save()
    res.json(todo)
})
app.delete('/todo/delete/:id', async (req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id)
    res.json(result)

})

app.get('/todo/complete/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id)
    todo.completed = !todo.completed

    todo.save()
    res.json(todo)
})


//  To edit the todo list particular item
app.put('/todo/edit/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id)
    todo.text = req.body.text
    todo.save()
    res.json(todo)
})

app.listen(3001, () => console.log("server conencted at port 3001"))



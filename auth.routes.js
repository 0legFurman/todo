const { Router, request } = require('express')
const User = require('./models/user')
const config = require('config')
const jwt = require('jsonwebtoken')
const router = Router()

router.post('/register', async (req, res) => {
    try {
        const { login, password } = req.body
        const candidate = await User.findOne({ login })
        if (candidate) {
            return res.status(400).json({ message: 'User with that login has already register' })
        }
        const user = new User({ login, password })
        await user.save()

        return res.status(201).json({ message: "User was created" })

    } catch (e) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body
        const user = await User.findOne({ login })
        if (!user) {
            return res.status(400).json({ message: 'User not find' })
        }
        const isMatch = password === user.password
        if (!isMatch) {
            return res.status(400).json({ message: 'Password is incorrect' })
        }
        const token = jwt.sign(
            { userID: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )
        res.json({ token, userID: user.id, userLogin: login, tasks: user.tasks })
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
})

router.get('/getUser/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        return res.status(200).json({ userName: user.login })
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
})

router.get('/getTasks/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        return res.status(200).json({ tasks: user.tasks })
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
})

router.post('/addTask/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const user = await User.findById(req.params.id)
        const newTask = {
            name,
            description,
        }
        if (user.tasks.find(task => task.name === name && task.description === description)) {
            return res.status(400).json({ message: 'Please add task with another name', tasks: user.tasks })
        }
        user.tasks.push(newTask)
        await user.save()
        return res.status(201).json({ message: 'Task was added', tasks: user.tasks })
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
})

router.post('/editTask/:userID/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const taskIndex = req.params.id;
        const user = await User.findById(req.params.userID)
        const newTask = {
            name,
            description,
        }
        const selectedTask = user.tasks.find((task, index) => index === taskIndex)
        if (JSON.stringify(selectedTask) === JSON.stringify(newTask)) {
            return res.status(400).json({ message: 'Please edit task with another data', tasks: user.tasks })
        }
        user.tasks.splice(taskIndex, 1, newTask)
        await user.save()
        return res.status(200).json({ message: 'Task was edited', tasks: user.tasks })
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
})

router.post('/deleteTask/:userID/:taskIndex', async (req, res) => {
    try {
        const user = await User.findById(req.params.userID)
        console.log(req.params.taskIndex)
        const newTasks = user.tasks.filter((task, index) => index != req.params.taskIndex)
        user.tasks = newTasks
        await user.save()
        return res.status(201).json({ message: 'Task was deleted', tasks: user.tasks })
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
})

module.exports = router;
const express =  require('express')
const app =  express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 8000
const Blog = require('./models/Blog')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended : true}))
app.use(express.json())

let db = 'mongodb+srv://brownBlog:brown33513140@cluster0.izru7.mongodb.net/note-tuts?retryWrites=true&w=majority'

mongoose.connect(db, {useNewUrlParser  : true, useUnifiedTopology : true})
    .then((result) => {
        console.log('connected to the database')
        app.listen(PORT, () => {
            console.log(`listening to ${PORT} local sever`)
        })
    })
    .catch(err => console.log(err))


app.get('/', (request, response) => {
    response.redirect('/blogs')
})

app.get('/contact', (request, response) => {
    response.render('contact.ejs', {title : 'Contact US'})
})

app.get('/about', (request, response) => {
    response.render('about.ejs', {title : 'About Us'})
})

app.get('/blogs/create',(request, response) => {
    response.render('create.ejs', {title : 'Create a new blog'})
})

app.post('/Createblog', (request, response) => {
    const blog = new Blog(request.body)

    blog.save()
    .then(result => {
        response.redirect('/blogs')

    })
    .catch(err => console.log(err))
})

app.get('/blogs', (request, response) => {
    Blog.find().sort({ createdAt : -1})
        .then(result => {
            response.render('index.ejs', { title : 'All Blogs', blog : result})
        })
})

app.get('/blogs/:id', (request, response) => {
    const id = request.params.id
    Blog.findById(id)
        .then(data => {
            response.render('details.ejs', {title : 'Blogs Detailed', result : data})
        })
        .catch(err => console.log(err))
})

app.delete('/blogs/:id', (request, response) => {
    const id =  request.params.id
    Blog.findByIdAndDelete(id)
        .then(result => {
            response.json({redirect : '/blogs'})
        })
        .catch(err => console.log(err))
})





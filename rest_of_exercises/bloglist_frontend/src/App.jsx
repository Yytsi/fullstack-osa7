import { useState, useRef, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogCreation from './components/BlogCreation'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { setBlogs } from './reducers/blogReducer'

const App = () => {
  const dispatch = useDispatch()
  const infoMessage = useSelector((state) => state.notification)
  const blogs = useSelector((state) => state.blogs)

  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const showBlogRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((receivedBlogs) => {
      dispatch(setBlogs(receivedBlogs))
    })
  }, [])

  const likeBlog = async (blog) => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    }

    const response = await blogService.putBlog(updatedBlog)
    const newBlogs = await blogService.getAll()
    dispatch(setBlogs(newBlogs))
  }

  const notifyWith = (message, type = 'info') => {
    dispatch(setNotification({ message, type }))
    setTimeout(() => {
      dispatch(setNotification({ message: '', type: 'info' }))
    }, 4000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      notifyWith(`Welcome back ${user.name} !`)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notifyWith('wrong credentials', 'error')
    }
  }

  const addBlog = async (blogObject) => {
    showBlogRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      const allBlogs = await blogService.getAll()
      dispatch(setBlogs(blogs.concat(returnedBlog)))
      notifyWith(
        `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )
    } catch (exception) {
      notifyWith('error creating blog', 'error')
      console.log('creating a blog and got exception', exception)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification info={infoMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button
        onClick={() => {
          window.localStorage.removeItem('loggedBlogAppUser')
          setUser(null)
        }}
      >
        logout
      </button>
      <Notification info={infoMessage} />
      <Togglable buttonLabel="new blog" ref={showBlogRef}>
        <BlogCreation
          blogs={blogs}
          setBlogs={(x) => dispatch(setBlogs(x))}
          notifyWith={notifyWith}
          blogRef={showBlogRef}
          addBlog={addBlog}
        />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            setBlogs={(x) => dispatch(setBlogs(x))}
            showRemoveButton={user.username === blog.user.username}
            likeBlog={likeBlog}
          />
        ))}
    </div>
  )
}

export default App

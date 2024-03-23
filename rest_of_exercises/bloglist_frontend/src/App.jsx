import { useState, useRef, useEffect } from 'react'
import { useContext } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogCreation from './components/BlogCreation'
import Togglable from './components/Togglable'
import NotificationContext, {
  setNotification,
  clearNotification,
} from './NotificationContext'
import UserContext, { setUser, clearUser } from './contexts/UserContext'
import DarkModeContext from './contexts/DarkModeContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import { UserList } from './components/UsersList'
import { UserBlogs } from './components/UserBlogs'
import { BlogExtView } from './components/BlogExtView'
import {
  PolishedBackground,
  ColouredBackground,
} from './styledcomponents/Backgrounds'
import { MaterialUISwitch } from './styledcomponents/Toggle'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const [user, userDispatch] = useContext(UserContext)
  const [darkMode, setDarkMode] = useContext(DarkModeContext)

  const showBlogRef = useRef()
  const queryClient = useQueryClient()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch(setUser(user))
    }
  }, [])

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
    refetchOnWindowFocus: false,
  })

  const blogs = result.data || []

  const blogIdMatch = useMatch('/blogs/:id')

  const blogPutMutation = useMutation({
    mutationFn: (blog) => blogService.putBlog(blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const blogAddMutation = useMutation({
    mutationFn: (blog) => blogService.create(blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const likeBlog = async (blog) => {
    blogPutMutation.mutate({
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    })
  }

  const notifyWith = (message, type = 'info') => {
    notificationDispatch(setNotification(message, type))
    setTimeout(() => {
      notificationDispatch(clearNotification())
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
      userDispatch(setUser(user))
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
      blogAddMutation.mutate(blogObject)
      notifyWith(`A new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch (exception) {
      notifyWith('error creating blog', 'error')
      console.log('creating a blog and got exception', exception)
    }
  }

  if (user === null) {
    return (
      <PolishedBackground color="#96ffaa" $nightMode={darkMode}>
        <div>
          <h2>Log in to application</h2>
          <Notification info={notification} />
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
      </PolishedBackground>
    )
  }

  return (
    <PolishedBackground color="#c4ffcd" $nightMode={darkMode}>
      <div>
        <ColouredBackground color="#ffaa96" $nightMode={darkMode}>
          <div
            style={{
              backgroundColor: 'lightgrey',
              padding: '5px',
              display: 'block',
            }}
          >
            <Link to="/" style={{ marginRight: '10px' }}>
              blogs
            </Link>
            <Link to="/users" style={{ marginRight: '10px' }}>
              users
            </Link>
            <span style={{ marginRight: '10px' }}>{user.name} logged in</span>
            <button
              style={{ marginRight: '10px' }}
              onClick={() => {
                window.localStorage.removeItem('loggedBlogAppUser')
                userDispatch(clearUser())
              }}
            >
              logout
            </button>
            <MaterialUISwitch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            >
              night mode
            </MaterialUISwitch>
          </div>
        </ColouredBackground>
        <h2>blog app</h2>
        <Notification info={notification} />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Togglable buttonLabel="new blog" ref={showBlogRef}>
                  <BlogCreation
                    blogs={blogs}
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
                      showRemoveButton={user.username === blog.user.username}
                      likeBlog={likeBlog}
                    />
                  ))}
              </div>
            }
          />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserBlogs />} />
          <Route
            path="/blogs/:id"
            element={
              <BlogExtView
                blog={
                  blogIdMatch
                    ? blogs.find((blog) => blog.id === blogIdMatch.params.id)
                    : null
                }
                showRemoveButton={
                  blogs && user && blogIdMatch
                    ? user.username ===
                      blogs.find((blog) => blog.id === blogIdMatch?.params?.id)
                        ?.user?.username
                    : false
                }
                likeBlog={likeBlog}
              />
            }
          />
        </Routes>
      </div>
    </PolishedBackground>
  )
}

export default App

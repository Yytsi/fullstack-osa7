import React, { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const BlogCreation = ({ blogs, notifyWith, blogRef, addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: title,
      author: author,
      url: url,
    }

    await addBlog(blogObject)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          <label htmlFor="titleInput">title:</label>
          <input
            id="titleInput"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor="authorInput">author:</label>
          <input
            id="authorInput"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor="urlInput">url:</label>
          <input
            id="urlInput"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogCreation.propTypes = {
  blogs: PropTypes.array.isRequired,
  notifyWith: PropTypes.func.isRequired,
  blogRef: PropTypes.object.isRequired,
  addBlog: PropTypes.func.isRequired,
}

export default BlogCreation

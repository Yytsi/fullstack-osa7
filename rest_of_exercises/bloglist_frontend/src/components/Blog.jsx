import React, { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, showRemoveButton, likeBlog }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    width: '50%'
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.deleteBlog(blog)
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)
    }
  }

  const expandedForm = () => {
    return (
      <div>
        {blog.title} <br />
        {blog.url} <br />
        likes {blog.likes} <button onClick={async () => {
          await likeBlog(blog)
        }}>like</button> <br />
        {blog.author}
        {showRemoveButton && <button onClick={handleRemove}>remove</button>}
      </div>
    )
  }

  const collapsedForm = () => {
    return (
      <div>
        {blog.title} {blog.author}
      </div>
    )
  }

  return (
    <div style={blogStyle} className='blog'>
      {isExpanded ? expandedForm() : collapsedForm()}
      <button onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? 'hide' : 'view'}</button>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  setBlogs: PropTypes.func.isRequired,
  showRemoveButton: PropTypes.bool.isRequired,
  likeBlog: PropTypes.func.isRequired
}

export default Blog
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export const BlogExtView = ({ blog, showRemoveButton, likeBlog }) => {
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')

  const deleteBlogMutation = useMutation({
    mutationFn: (blog) => blogService.deleteBlog(blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await deleteBlogMutation.mutateAsync(blog)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    try {
      await blogService.addComment(blog.id, comment)
      setComment('')
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    } catch (error) {
      console.error(error)
    }
  }

  if (!blog) {
    return <div>blog does not exist or is not loaded properly yet</div>
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>
        {blog.likes} likes
        <button onClick={() => likeBlog(blog)}>like</button>
      </p>
      <p>added by {blog.user.name}</p>
      {showRemoveButton && <button onClick={handleRemove}>remove</button>}

      <h3>comments</h3>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

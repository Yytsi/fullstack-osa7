import { useQuery } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const BlogExtView = ({ blog, showRemoveButton, likeBlog }) => {
  const queryClient = useQueryClient()

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

  if (!blog) {
    return <div>blog doesn't exist or is not loaded properly yet</div>
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
    </div>
  )
}

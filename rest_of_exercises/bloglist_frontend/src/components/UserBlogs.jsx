import { useMatch } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAllUsers } from '../services/users'

export const UserBlogs = () => {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers(),
  })

  const match = useMatch('/users/:id')
  const thisUser =
    match && usersQuery.isSuccess
      ? usersQuery.data.find((user) => user.id === match.params.id)
      : null

  if (!thisUser) {
    return null
  }

  return (
    <div>
      <h2>{thisUser.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {thisUser.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const getAllForUser = (user) => {
  return getAll().then((blogs) => {
    console.log('user at getAllForUser', user)
    console.log('blogs at getAllForUser', blogs)
    return blogs.filter((blog) => blog.user.username === user.username)
  })
}

const putBlog = async (blog) => {
  console.log('blog at putBlog', blog)
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog)
  return response.data
}

const deleteBlog = async (blog) => {
  console.log('blog at deleteBlog', blog)
  const config = {
    headers: {
      Authorization: `bearer ${JSON.parse(localStorage.getItem('loggedBlogAppUser')).token}`,
    },
  }
  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

const create = async (newBlog) => {
  console.log(
    'user from storage inside create',
    JSON.parse(localStorage.getItem('loggedBlogAppUser'))
  )
  const config = {
    headers: {
      Authorization: `bearer ${JSON.parse(localStorage.getItem('loggedBlogAppUser')).token}`,
    },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const addComment = async (blogId, comment) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, {
    comment,
  })
  return response.data
}

export default {
  getAll,
  getAllForUser,
  create,
  putBlog,
  deleteBlog,
  addComment,
}

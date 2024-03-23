import { createContext, useReducer } from 'react'

const blogReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BLOGS':
      return action.data
    case 'ADD_BLOG':
      return state.concat(action.data)
    case 'LIKE_BLOG':
      return state.map((blog) =>
        blog.id === action.data.id ? action.data : blog
      )
    case 'REMOVE_BLOG':
      return state.filter((blog) => blog.id !== action.data.id)
    default:
      return state
  }
}

const BlogContext = createContext([])

export const BlogProvider = ({ children }) => {
  const [blogs, dispatch] = useReducer(blogReducer, [])

  return (
    <BlogContext.Provider value={[blogs, dispatch]}>
      {children}
    </BlogContext.Provider>
  )
}

export const setBlogs = (blog) => {
  return {
    type: 'SET_BLOGS',
    data: blog,
  }
}

export default BlogContext

import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    updateBlog: (state, action) => {
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog
      )
    },
    removeBlog: (state, action) => {
      return state.filter((blog) => blog.id !== action.payload)
    },
    setBlogs: (state, action) => {
      return action.payload
    },
  },
})

export const { updateBlog, removeBlog, setBlogs } = blogSlice.actions
export default blogSlice.reducer

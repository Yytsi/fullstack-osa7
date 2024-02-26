
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog component title only', () => {
  const blog = {
    title: 'My blog title',
    user: {
      username: 'user'
    },
    url: 'hereurl',
    likes: 142
  }

  render(<Blog blog={blog} showRemoveButton={true} setBlogs={() => {}}
    likeBlog={() => {}}/>)

  expect(screen.getByText('My blog title')).toBeInTheDocument()
  const url = screen.queryByText('hereurl')
  expect(url).toBeNull()
  const likes = screen.queryByText('likes 142')
  expect(likes).toBeNull()
})

test('renders blog component title only', async () => {
  const blog = {
    title: 'My blog title',
    user: {
      username: 'user'
    },
    url: 'hereurl',
    likes: 142
  }

  render(<Blog blog={blog} showRemoveButton={true} setBlogs={() => {}}
    likeBlog={() => {}}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')

  const url = screen.queryByText('hereurl')
  expect(url).toBeNull()
  const likes = screen.queryByText('likes')
  expect(likes).toBeNull()

  await user.click(button)

  const likeText = screen.queryByText('likes', { exact: false })
  expect(likeText).toBeInTheDocument()
  const urlText = screen.queryByText('hereurl', { exact: false })
  expect(urlText).toBeInTheDocument()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'My blog title',
    user: {
      username: 'user'
    },
    url: 'hereurl',
    likes: 142
  }

  const likeBlog = jest.fn()

  render(<Blog blog={blog} showRemoveButton={true} setBlogs={() => {}}
    likeBlog={likeBlog}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')

  await user.click(button)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(likeBlog.mock.calls).toHaveLength(2)
})
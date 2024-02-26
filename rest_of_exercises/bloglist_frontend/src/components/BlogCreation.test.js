import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogCreation from './BlogCreation'

test('sends the correct data when creating a blog', async () => {
  const addBlog = jest.fn()
  const toggleVisibility = jest.fn()

  render(<BlogCreation blogs={[]} setBlogs={() => {}}
    notifyWith={() => {}} blogRef={{ current: { toggleVisibility } }}
    addBlog={addBlog}/>)

  const title = screen.getByLabelText('title:')
  const author = screen.getByLabelText('author:')
  const url = screen.getByLabelText('url:')
  const submitButton = screen.getByRole('button', { name: /create/i })

  const user = userEvent.setup()

  await user.type(title, 'My blog title')
  await user.type(author, 'Author')
  await user.type(url, 'hereurl')
  await user.click(submitButton)

  await waitFor(() => {
    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0]).toEqual({
      title: 'My blog title',
      author: 'Author',
      url: 'hereurl'
    })
  })
})
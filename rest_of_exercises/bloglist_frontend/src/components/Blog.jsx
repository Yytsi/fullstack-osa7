import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { styled } from 'styled-components'

const BlogStyle = styled('div')`
  padding-top: 10px;
  padding-left: 2px;
  border: solid;
  border-width: 1px;
  margin-bottom: 5px;
  width: 50%;
  border-radius: 5px;
  padding: 10px 10px;
  background-color: #ffcef3;
`

const Blog = ({ blog }) => {
  return (
    <BlogStyle>
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </BlogStyle>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog

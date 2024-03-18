const router = require("express").Router();
const Blog = require("../models/blog");

const { userExtractor } = require("../utils/middleware");

router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

router.post("/", userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  });

  const user = request.user;

  if (!user) {
    return response.status(401).json({ error: "operation not permitted" });
  }

  blog.user = user._id;

  const createdBlog = await blog.save();

  user.blogs = user.blogs.concat(createdBlog._id);
  await user.save();

  const populatedBlog = await Blog.findById(createdBlog.id).populate("user", {
    username: 1,
    name: 1,
  });

  response.status(201).json(populatedBlog);
});

router.put("/:id", async (request, response) => {
  const { title, url, author, likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, url, author, likes },
    { new: true },
  );

  response.json(updatedBlog);
});

router.delete("/:id", userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  const user = request.user;

  if (!user || blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: "operation not permitted" });
  }

  user.blogs = user.blogs.filter((b) => b.toString() !== blog.id.toString());

  await user.save();
  await Blog.findByIdAndRemove(request.params.id);

  response.status(204).end();
});

router.post("/:id/comments", async (request, response) => {
  const { comment } = request.body;

  // the post format is this
  //{
  //  comment: 'this is a comment'
  //}

  const blog = await Blog.findById(request.params.id);
  blog.comments = blog.comments.concat(comment);
  await blog.save();

  response.status(201).json(blog);
});

module.exports = router;

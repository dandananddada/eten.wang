/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path")
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const gameResult = await graphql(`
    {
      allGamesYaml {
        edges {
          node {
            data {
              year,
              games {
                name
                image
                score
                platform
              }
            }
          }
        }
      } 
    }
  `)
  if (gameResult.errors) {
    return Promise.reject(gameResult.errors)
  }
  const GamesTemplate = path.resolve(`src/templates/game/games.template.js`)
  gameResult.data.allGamesYaml.edges.forEach(({ node }) => {
    const { data } = node
    const { year, games } = data
    createPage({
      path: `/games/${year}`,
      component: GamesTemplate,
      context: { year, games }
    })
  })

  const markdownResult = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              category,
              path
            }
          }
        }
      }
    }
  `)
  if (markdownResult.errors) {
    return Promise.reject(markdownResult.errors)
  }

  const ROOT_PATH = '/posts'
  const BlogPageTemplate = path.resolve(`src/templates/blog/page.js`)
  const BlogContentTamplate = path.resolve(`src/templates/blog/content.js`)
  const posts = markdownResult.data.allMarkdownRemark.edges
  const postsPerPage = 12
  const numPages = Math.ceil(posts.length / postsPerPage)
  Array.from({ length: numPages }).forEach((_, i) => {
    const page = i + 1
    createPage({
      path: i === 0 ? ROOT_PATH : `${ROOT_PATH}/${page}`,
      component: BlogPageTemplate,
      context: {
        limit: postsPerPage,
        offset: i * postsPerPage,
        prevPage: i <= 2 ? '' : i,
        nextPage: numPages <= page ? '' : page + 1
      }
    })
  }) 
  posts.forEach(({ node }) => { // blog content
    const { path: location, category } = node.frontmatter
    const path = `${ROOT_PATH}/${category}/${location}`
    createPage({
      path,
      component: BlogContentTamplate,
      context: {
        location,
        category
      }
    })
  })
}

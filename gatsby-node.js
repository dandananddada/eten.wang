/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

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

  const blogTemplate = path.resolve(`src/templates/blog/blog.js`)
  markdownResult.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: blogTemplate,
      context: {}, // additional data can be passed via context
    })
  })
}

import React from "react"
import { graphql } from "gatsby"
import BlogHeader from "./components/header"
import './blog.scss';

export default function BlogContentsTamplate ({ pageContext, data, // this prop will be injected by the GraphQL query below.
}) {
  const PATH = '/posts'
  const { prevPage, nextPage } = pageContext
  const posts = data.allMarkdownRemark.edges

  const link = (page, text) => {
    if (page) {
      const link = (page === 1 ? PATH : `${PATH}${page}`) // rewrite page 1 to posts.
      return (<a className="pagination-item" href={link}>{text}</a>)
    }
    return (<span className="pagination-item disabled">{text}</span>)
  }

  return (
    <>
      <BlogHeader></BlogHeader>
      <div className="page-content">
        <div className="wrapper">
          <div className="home">
            <ul className="post-list">
              {posts.map(({ node }) => {
                const { path, category, date, title, summary } = node.frontmatter
                const link = `${PATH}/${category}/${path}/`
                return (
                  <li className="post" key={title}>
                    <span className="post-meta">{ date }</span>
                    <h2>
                      <a className="post-link" href={link}>{ title }</a>
                    </h2>
                    <p className="post-summary">{ summary }</p>
                  </li>
                )
              })}
            </ul>
            <div className="pagination clearfix mb1 mt4">
              <div className="left">
                { link(`/${prevPage}`, 'Previous') }
              </div>
              <div className="right">
                { link(`/${nextPage}`, 'Next') }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const pageQuery = graphql`
  query($limit: Int!, $offset: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $offset
    ) {
      edges {
        node {
          frontmatter {
            path
            category
            title
            date(formatString: "MMMM DD, YYYY")
            summary
          }
        }
      }
    }
  }
`
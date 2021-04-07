import React from "react"
import { graphql } from "gatsby"

import './blog.scss';

export default function BlogPageTemplate({ data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark
  return (
    <div className="page-content">
      <div className="wrapper">
        <div className="post">
          <header className="post-header">
            <h1 className="post-title">{frontmatter.title}</h1>
            <p className="post-meta">{frontmatter.date}</p>
          </header>
          <article className="post-content"
            dangerouslySetInnerHTML={{ __html: html }}>
          </article>
        </div>
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query($location: String!, $category: String!) {
    markdownRemark(frontmatter: { path: { eq: $location }, category: { eq: $category } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        category
        title
      }
    }
  }
`
import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <Link to="/posts">博客</Link>
    <Link to="/games/2021">游戏</Link>
  </Layout>
)

export default IndexPage

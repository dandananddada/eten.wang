import React from "react"
import { graphql } from "gatsby"
import Games from "../../templates/game/games.template"

const SecondPage = ({
  data: {
    allGamesYaml: {
      edges: [{
        node: {
          data: {
            games
          }
        }
      }]
    }
  }
}) => 
(
  <p>hello world</p>
  // <Games games={games}></Games>
)


export default SecondPage

export const query = graphql`query {
  allGamesYaml (filter: {
    data: {
      year: {
        eq: 2019
      }
    }
  }) {
    edges {
      node {
        data {
          year,
          games {
            name
            score
            platform
          }
        }
      }
    }
  } 
}`
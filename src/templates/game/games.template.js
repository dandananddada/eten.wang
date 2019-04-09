import React from "react"
import * as Styled from "./games.styled.js";

const GamesTemplate = ({ pageContext }) => {
  const { games, year } = pageContext 
  return (
    <React.Fragment>
      <Styled.GlobalStyle />
      <Styled.Games>
        <Styled.Title>{year} Games</Styled.Title>
        { games && games.map(game => (
          <Styled.Game key={game.name}>
            <Styled.Image src={game.image}></Styled.Image>
            <Styled.BottomContainer>
              <Styled.Score>
                {game.score}
              </Styled.Score>
              <Styled.Content>
                <Styled.Platform>{game.platform}</Styled.Platform>
                <Styled.Name>{game.name}</Styled.Name>
              </Styled.Content>
            </Styled.BottomContainer>
          </Styled.Game>
        )) }
      </Styled.Games>
    </React.Fragment>
  )
}
export default GamesTemplate

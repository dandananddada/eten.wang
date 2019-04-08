import React from "react"
import * as Styled from './game.style.js';

const Games = ({ pageContext }) => {
  const { games } = pageContext 
  debugger
  return (
    <Styled.Games>
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
  )
}
export default Games

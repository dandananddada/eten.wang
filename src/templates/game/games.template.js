import React from "react"
import * as Styled from "./games.styled.js"
import { aliyun as imageSource } from "../../helper/image"

const GamesTemplate = ({ pageContext }) => {
  const { games, year } = pageContext
  return (
    <React.Fragment>
      <Styled.GlobalStyle />
      <Styled.Games>
        <Styled.Title>{year} Games</Styled.Title>
        { games && games.map(game => {
            const { name, score, platform, platinum } = game
            const image = imageSource(year, name)
            return (
                <Styled.Game key={name}>
                    <Styled.Image image={image}></Styled.Image>
                    <Styled.BottomContainer>
                        <Styled.Score> {score} </Styled.Score>
                        <Styled.Content>
                            <Styled.Platform>{platform}</Styled.Platform>
                            <Styled.Name>{name}</Styled.Name>
                            { platinum && (<Styled.Platinum></Styled.Platinum>) }
                        </Styled.Content>
                    </Styled.BottomContainer>
                </Styled.Game>
            )
        })}
      </Styled.Games>
    </React.Fragment>
  )
}
export default GamesTemplate

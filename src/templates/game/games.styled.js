import styled, { createGlobalStyle } from "styled-components"
import WH from "../../helper/wh"
import DINEngschriftAlternate from "../../fonts/DINEngschrift-Alternate.otf"
import MFZiZaiNoncommercialRegular from "../../fonts/MFZiZai_Noncommercial-Regular.ttf"

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'DINEngschrift-Alternate';
    font-style: normal;
    font-weight: normal;
    src: local('DINEngschrift-Alternate'), url(${DINEngschriftAlternate}) format('truetype');
  }
  @font-face {
    font-family: 'MFZiZai_Noncommercial-Regular';
    font-style: normal;
    font-weight: normal;
    src: url(${MFZiZaiNoncommercialRegular}) format('truetype');
  }
  body {
    background-color: #F3F3F3;
  }
`
console.log(DINEngschriftAlternate);
export const Games = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: ${WH(24)};
`

export const Title = styled.div`
  width: 100%;
  margin-bottom: ${WH(14)}
  text-align: center;
  color: #29A987;
  font-size: ${WH(30)}
  font-family: DINEngschrift-Alternate;
`

export const Game = styled.div`
  width: ${WH(280)};
  margin-bottom: ${WH(20)};
  border-radius: ${WH(8)};
  box-shadow: 0 ${WH(4)} ${WH(12)} 0 rgba(0, 0, 0, 0.09);
`
export const Image = styled.img`
  width: ${WH(280)}
  margin-bottom: 0;
  background-color: #FFF;
  border-width: 0;
  border-top-left-radius: ${WH(8)};
  border-top-right-radius: ${WH(8)};
`
export const BottomContainer = styled.div`
  display: flex;
  padding: ${WH(10)} ${WH(6)} ${WH(12)} ${WH(10)};
  background-color: #FFF;
  border-bottom-left-radius: ${WH(8)};
  border-bottom-right-radius: ${WH(8)};
`

export const Score = styled.div`
  ${WH(36, 36)};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${WH(8)};
  color: #FFF;
  background-color: #29A987;
  border-radius: ${WH(5)};
  font-size: ${WH(28)};
  font-family: DINEngschrift-Alternate;
`

export const Content = styled.div`
`

export const Platform = styled.p`
  height: ${WH(12)};
  margin-top: 0;
  margin-bottom: 0;
  color: #9A9A9D;
  font-size: ${WH(12)};
  font-weight: 100;
  font-family: DINEngschrift-Alternate;
`
export const Name = styled.p`
  margin: ${WH(2)} 0 ${WH(3)};
  color: #010101;
  font-size: ${WH(16)};
  font-family: MFDianHei_Noncommercial-Regular;
  font-weight: 400;
`
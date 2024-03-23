import styled from 'styled-components'

export const PolishedBackground = styled('div')`
  background-color: ${(props) => props.color};
  padding: 10px;
  border: 2px solid black;
  border-radius: 10px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  ${(props) =>
    props.$nightMode &&
    `
    background-color: #2c3e50;
    color: #ecf0f1;
    border-color: #34495e;
  `}
`

export const ColouredBackground = styled('div')`
  background-color: ${(props) => props.color};
  padding: 1px;
  border: 1px solid black;
  border-radius: 5px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  ${(props) =>
    props.$nightMode &&
    `
    background-color: #34495e;
    color: #ecf0f1;
    border-color: #2c3e50;
  `}
`

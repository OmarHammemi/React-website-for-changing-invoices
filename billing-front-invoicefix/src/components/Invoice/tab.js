import styled from "styled-components";
export const Tabs = styled.div`
  overflow: hidden;
  background: #fff;
  font-family: Open Sans;
  height: 3em;
  display: flex;
  border-bottom: 1px solid #333;
`;

export const Tab = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  width: 50%;
  position: relative;
  font-weight: bold;
  color: #333;

  margin-right: 0.1em;
  font-size: 1em;
  border-bottom: ${props => (props.active ? "none" : "")};
  background-color: ${props => (props.active ? "white" : "#333")};
  color: ${props => (props.active ? "#333" : "white")};
  height: ${props => (props.active ? "3em" : "2.6em; top:.4em")};
  transition: background-color 0.5s ease-in-out;

  :hover {
    background-color: white;
    color: #333;
  }
`;
export const Content = styled.div`
  padding-top: 20px;
  ${props => (props.active ? "" : "display:none")}
`;

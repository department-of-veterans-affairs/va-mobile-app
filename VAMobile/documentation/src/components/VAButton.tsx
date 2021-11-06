import React, { useState } from 'react'
import styled from 'styled-components'

// Watch the Button tutorial
// http://react.school/ui/button

// Free React training
// http://react.school/join

// Free Material-UI template
// http://react.school/material-ui/templates

const theme = {
  blue: {
    default: '#3f51b5',
    hover: '#283593',
  },
  pink: {
    default: '#e91e63',
    hover: '#ad1457',
  },
}

const Button = styled.button`
  background-color: ${(props) => theme[props.theme].default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: ${(props) => theme[props.theme].hover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`

Button.defaultProps = {
  theme: 'blue',
}

function clickMe() {
  alert('You clicked me!')
}

export default function App(): JSX.Element {
  return (
    <>
      <div>
        <Button onClick={clickMe}>Button</Button>
      </div>
      <div>
        <Button theme="pink" onClick={clickMe}>
          Pink theme
        </Button>
      </div>
      <div>
        <Button disabled onClick={clickMe}>
          Disabled
        </Button>
      </div>
      <a href="https://react.school" target="_blank">
        <Button>Link</Button>
      </a>
    </>
  )
}

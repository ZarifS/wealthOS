import { createGlobalStyle } from 'styled-components/macro'

export default createGlobalStyle`  
  body {
    margin: 0;
    font-family: 'IBM Plex Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
  
  h1 {
    font-size: 36px;
  }

  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 20px;
  }

  p {
    font-size: 14px;
  }

  body,
  h1,
  h2,
  h3,
  h4,
  p {
      margin: 0;
      padding: 0;
      border: 0;
      font-weight: normal;
  }

  /* Global <a> links */
  a:link {
      text-decoration: none;
      color: inherit;
  }

  a:visited {
      text-decoration: none;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #454545;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: grey;
  }
`

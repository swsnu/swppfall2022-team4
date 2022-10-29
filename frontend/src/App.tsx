import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

import FugazOne from 'assets/fonts/FugazOne.ttf';
import IBMPlexSansThaiLooped from 'assets/fonts/IBMPlexSansThaiLooped.ttf';

import Main from 'containers/Main';
import Login from 'containers/user/Login';
import Signup from 'containers/user/Signup';

const GlobalStyles = createGlobalStyle`
  ${reset}
  * {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
    outline: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    img {
      -webkit-user-drag: none;
    }
    a {
      -webkit-user-drag: none;
    }
    select {
      -ms-user-select: none;
      -moz-user-select: -moz-none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      user-select: none;
    }
    strong{
      font-weight: bold;
    }
    em{
      font-style: italic;
    }
  }
  html {
    height: 100%;
  }
  body {
    box-sizing: border-box;
    min-height: 100%;
    line-height: 1;
  }
  #root {
    min-height: 100%;
  }
  a {
    color: inherit;
    text-decoration: none;
  } 

  @font-face {
    font-family: FugazOne;
    src: url(${FugazOne}) format("truetype");
  }
  @font-face {
    font-family: IBMPlexSansThaiLooped;
    src: url(${IBMPlexSansThaiLooped}) format("truetype");
  }
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<InsideComponent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

const InsideComponent = () => {
  return (
    <Routes>
      <Route path="" element={<Main />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="*" element={<div>After Login</div>} />
    </Routes>
  );
};

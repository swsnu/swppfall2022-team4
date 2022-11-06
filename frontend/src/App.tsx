import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

import FugazOne from 'assets/fonts/FugazOne.ttf';
import IBMPlexSansThaiLooped from 'assets/fonts/IBMPlexSansThaiLooped.ttf';
import NanumSquareR from 'assets/fonts/NanumSquareR.ttf';

import Header from 'components/sections/Header';
import Footer from 'components/sections/Footer';
import NotFound from 'components/common/NotFound';

import Main from 'containers/Main';
import Login from 'containers/user/Login';
import Signup from 'containers/user/Signup';
import Mypage from 'containers/user/Mypage';
import EditProfile from 'containers/user/EditProfile';
import EditPassword from 'containers/user/EditPassword';

import PostMain from 'containers/post/PostMain';
import PostCreate from 'containers/post/PostCreate';
import PostEdit from 'containers/post/PostEdit';
import PostDetail from 'containers/post/PostDetail';

import WorkoutLog from 'containers/workout/WorkoutLog';

import GroupList from 'containers/group/GroupList';
import GroupDetail from 'containers/group/GroupDetail';
import GroupCreate from 'containers/group/GroupCreate';
import GroupMembers from 'containers/group/GroupMembers';

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
  @font-face { 
    font-family: NanumSquareR;
    src: url(${NanumSquareR}) format("truetype");
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
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route
        path="*"
        element={
          <Wrapper>
            <Header />

            <Routes>
              <Route path="" element={<Main />} />

              <Route path="post/*">
                <Route path="" element={<PostMain />} />
                <Route path="create" element={<PostCreate />} />
                <Route path=":id" element={<PostDetail />} />
                <Route path=":id/edit" element={<PostEdit />} />
              </Route>

              <Route path="profile/:username" element={<Mypage />} />
              <Route path="edit_profile" element={<EditProfile />} />
              <Route path="edit_password" element={<EditPassword />} />

              <Route path="workout" element={<WorkoutLog />} />

              <Route path="group/*">
                <Route path="" element={<GroupList />} />
                <Route path="detail/:group_id" element={<GroupDetail />} />
                <Route path="detail/:group_id/member" element={<GroupMembers />} />
                <Route path="create" element={<GroupCreate />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
          </Wrapper>
        }
      />
    </Routes>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
`;

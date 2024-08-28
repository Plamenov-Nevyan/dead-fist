import {Routes, Route, useLocation} from "react-router-dom"
import {Home} from "./components/Home/Home";
import {Header} from "./components/Header/Header";
import {Login} from "./components/Auth/Login/Login";
import {Register} from "./components/Auth/Register/Register";
import {CharacterCreator} from "./components/CharacterCreator/CharacterCreator";
import {NotificationsProvider} from "./contexts/NotificationsContext";
import {RouteInterceptor} from "./components/common/RouteInterceptor";
import {AuthProvider} from "./contexts/authContext";
import {IntroScene} from "./components/IntroScene/IntroScene";

function App() {
  const location = useLocation()
  return (
    <AuthProvider>
      <NotificationsProvider>
        {location.pathname !== '/intro' && <Header />}
        <Routes>
        <Route element={<RouteInterceptor />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element = {<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-character" element={<CharacterCreator />} />
            <Route path="/intro" element={<IntroScene />} />
          </Route>
        </Routes>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export default App;

import {Routes, Route} from "react-router-dom"
import {Home} from "./components/Home/Home";
import {Header} from "./components/Header/Header";
import {Login} from "./components/Auth/Login/Login";
import {Register} from "./components/Auth/Register/Register";
import {CharacterCreator} from "./components/CharacterCreator/CharacterCreator";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element = {<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-character" element={<CharacterCreator />} />
      </Routes>
    </>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./features/authentication/components/Login";
import Register from "./features/authentication/components/Register";
import Protected from "./features/authentication/components/Protected";
import Home from "./features/Interview/Components/Home";
import Interview from "./features/Interview/Components/Interview";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Protected><Home/></Protected>} />
        <Route path="/interview" element={<Interview/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

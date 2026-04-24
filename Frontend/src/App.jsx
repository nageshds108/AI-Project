import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./features/authentication/components/Login";
import Register from "./features/authentication/components/Register";
import Protected from "./features/authentication/components/Protected";
import Home from "./features/Interview/Components/Home";
import Interview from "./features/Interview/Components/Interview";

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Protected><Home/></Protected>} />
        <Route path="/interview/:id" element={<Protected><Interview/></Protected>} />
        <Route path="/interview" element={<Protected><Interview/></Protected>} />
        <Route path="/reports/:id" element={<Protected><Interview/></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

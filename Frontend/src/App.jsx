import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./features/authentication/components/Login";
import Register from "./features/authentication/components/Register";
import Protected from "./features/authentication/components/Protected";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Protected><div>Welcome to the App</div></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

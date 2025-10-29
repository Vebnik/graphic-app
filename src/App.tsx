import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import GraphicPage from "@/pages/graphic";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<GraphicPage />} path="/graphic" />
    </Routes>
  );
}

export default App;

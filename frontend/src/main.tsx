import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserDataProvider } from "./contexts/userDataContext.tsx";
import { StarknetProvider } from "./components/StarknetProvider/index.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StarknetProvider>
      <UserDataProvider>
        <App />
      </UserDataProvider>
    </StarknetProvider>
  </StrictMode>
);

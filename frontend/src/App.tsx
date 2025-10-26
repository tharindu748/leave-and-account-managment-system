// import { useEffect } from "react";
// import { useAuth } from "./context/auth-context";
// import AppRoutes from "./routes";

// function App() {
//   const { checkAuth } = useAuth();

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   return <AppRoutes />;
// }

// export default App;
import { useEffect } from "react";
import { useAuth } from "./context/auth-context";
import AppRoutes from "./routes";

function App() {
  const { checkAuth, isLoading } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
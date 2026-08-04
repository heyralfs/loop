import GameScreen from "../screens/game";
import Sandbox from "../screens/sandbox";

function App() {
  // Dev-only component gallery — visit "?sandbox".
  if (
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("sandbox")
  ) {
    return <Sandbox />;
  }

  return <GameScreen />;
}

export default App;

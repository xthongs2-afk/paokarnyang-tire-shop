import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import TireDetail from "./pages/TireDetail";
import Tires from "./pages/Tires";

function Routes() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/tires"} component={Tires} />
      <Route path={"/tires/:handle"} component={TireDetail} />
      <Route path={"/services"} component={Services} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <WouterRouter>
        <Routes />
      </WouterRouter>
    </ErrorBoundary>
  );
}

export default App;

import { useEffect, useRef } from "react";
import { Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import TireDetail from "./pages/TireDetail";
import Tires from "./pages/Tires";

/** Client-side links keep the old scroll position; start each newly opened page at the top. */
function ScrollToTop() {
  const [location] = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // "instant": the site's smooth scroll-behavior gets cut short by the new page's render.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

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

/** `ssrPath` is set only by the build-time prerender (src/entry-server.tsx). */
function App({ ssrPath }: { ssrPath?: string }) {
  return (
    <ErrorBoundary>
      <WouterRouter ssrPath={ssrPath}>
        <ScrollToTop />
        <Routes />
      </WouterRouter>
    </ErrorBoundary>
  );
}

export default App;

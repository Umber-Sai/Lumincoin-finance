import { Router } from "./router.js";

class App {
  constructor () {
      this.router = new Router();
      window.addEventListener('DOMContentLoaded', this.handlerRouteChanging.bind(this));
      window.addEventListener('popstate', this.handlerRouteChanging.bind(this));
  }

  handlerRouteChanging () {
      this.router.openRoute();
  }
}

(new App())
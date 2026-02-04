import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import "assets/vendors/style";
import configureStore, { history } from "./appRedux/store";
import App from "./containers/App/index";
const store = configureStore(/* provide initial state if any */);

const NextApp = () => {
  // configureAmplify();
  return (
    // <ApolloProvider client={client}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </ConnectedRouter>
    </Provider>
    // </ApolloProvider>
  );
};
export default NextApp;

/* @flow */
import React from 'react';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { Redirect, Route, Router } from 'react-router';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Loader from './components/loader';
import sync from './hocomponents/sync';
import actions from './store/api/actions';
//import Services from './views/services';

const Login = Loadable({
  loader: () => import(/* webpackChunkName: "login" */ './views/auth'),
  loading: Loader,
});

const ErrorView = Loadable({
  loader: () => import(/* webpackChunkName: "error" */ './error'),
  loading: Loader,
});

class AppInfo extends React.Component {
  props: {
    info: any;
    logout: Function;
    routerProps: any;
  } = this.props;

  componentDidMount() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'loadSystem' does not exist on type '{ in... Remove this comment to see the full error message
    //
  }

  render() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'plugins' does not exist on type '{ info:... Remove this comment to see the full error message
    let { info, oauth2_enabled } = this.props;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
    if (info.error) {
      return (
        <Router {...this.props.routerProps}>
          <Route path="/error" component={ErrorView} />
        </Router>
      );
    }

    return (
      <Router
        {...this.props.routerProps}
        basename={process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : ''}
      >
        <Route path="/" component={Login} />
        <Route path="/error" component={ErrorView} />
        <Redirect from="*" to="/" />
      </Router>
    );
  }
}

export default compose<any, any>(
  connect(
    (state) => ({
      info: state.api.info,
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'info' does not exist on type '{}'.
      load: actions.info.fetch,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'logout' does not exist on type '{}'.
      logout: actions.logout.logout,
    }
  ),
  sync('info', true),
  onlyUpdateForKeys(['info'])
)(AppInfo as any) as any;

// @flow
import {
  ReqoreControlGroup,
  ReqoreInput,
  ReqoreLayoutContent,
  ReqoreMessage,
  ReqoreP,
  ReqorePanel,
  ReqoreUIProvider,
} from '@qoretechnologies/reqore';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import elementsLogo from '../../../img/elements.png';
import logo from '../../../img/qorus_engine_logo_white.png';
import titleManager from '../../hocomponents/TitleManager';
import settings from '../../settings';
import { post } from '../../store/api/utils';

type Props = {
  location: any;
  info: any;
  handleFormSubmit: () => void;
  loginStatus: any;
  handleUsernameChange: Function;
  handlePasswordChange: Function;
  changePassword: Function;
  changeUsername: Function;
  username: string;
  password: string;
};

const Login: Function = ({
  info,
  handleFormSubmit,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'loading' does not exist on type 'Object'... Remove this comment to see the full error message
  loginStatus: { loading, error, hasNext, hasLogout },
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <ReqoreUIProvider
    theme={{ main: '#111111', intents: { success: '#4a7110' } }}
    options={{ animations: { buttons: false } }}
  >
    <ReqoreLayoutContent
      style={{
        background: `url(${elementsLogo})`,
        backgroundPosition: 'bottom right',
        backgroundRepeat: 'no-repeat',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img src={logo} style={{ width: 400 }} />
      <ReqorePanel
        minimal
        contentEffect={{
          gradient: { colors: { 100: '#000000', 0: '#230b27' }, direction: 'to right bottom' },
        }}
        bottomActions={[
          {
            icon: 'CheckLine',
            label: 'Submit',
            intent: 'success',
            onClick: handleFormSubmit,
            fluid: true,
            position: 'right',
            loading,
            minimal: true,
          },
        ]}
      >
        <form onSubmit={handleFormSubmit}>
          {hasLogout && (
            <ReqoreMessage intent="success" opaque={false} margin="bottom">
              You have been successfuly logged out
            </ReqoreMessage>
          )}
          {hasNext && (
            <ReqoreMessage intent="info" opaque={false} margin="bottom">
              Log in to access {hasNext}
            </ReqoreMessage>
          )}
          {error && (
            <ReqoreMessage intent="danger" opaque={false} margin="bottom">
              {error}
            </ReqoreMessage>
          )}
          <ReqoreControlGroup vertical fluid>
            <ReqoreP>Username</ReqoreP>
            <ReqoreInput
              id="username"
              required={true}
              focusRules={{ type: 'auto' }}
              disabled={loading}
              onChange={handleUsernameChange}
              value={username}
              width={400}
            />
            <ReqoreP>Password</ReqoreP>
            <ReqoreInput
              id="password"
              type="password"
              disabled={loading}
              onChange={handlePasswordChange}
              value={password}
              width={400}
            />
          </ReqoreControlGroup>
        </form>
      </ReqorePanel>
    </ReqoreLayoutContent>
  </ReqoreUIProvider>
);

export default compose(
  connect((state) => ({ info: state.api.info.data })),
  withState('username', 'changeUsername', null),
  withState('password', 'changePassword', null),
  withState('loginStatus', 'changeLoginStatus', ({ location }) => ({
    loading: false,
    text: null,
    error: null,
    hasNext: location.query.next === '/error' ? undefined : location.query.next,
    hasLogout: location.query.logout,
  })),
  withHandlers({
    handleUsernameChange:
      ({ changeUsername }: Props): Function =>
      ({ target }): void => {
        changeUsername(() => target.value);
      },
    handlePasswordChange:
      ({ changePassword }: Props): Function =>
      ({ target }): void => {
        changePassword(() => target.value);
      },
    handleFormSubmit:
      ({ username, password, changeLoginStatus, location }): Function =>
      // @ts-ignore ts-migrate(1055) FIXME: Type 'void' is not a valid async function return t... Remove this comment to see the full error message
      async (e: any): void => {
        e?.preventDefault();

        changeLoginStatus((loginStatus) => ({
          ...loginStatus,
          loading: true,
          error: null,
        }));

        const loginData: any = await post(`${settings.REST_BASE_URL}/public/login`, {
          body: JSON.stringify({ user: username, pass: password }),
        });

        // @ts-ignore ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'.
        if (loginData.err) {
          changeLoginStatus((loginStatus) => ({
            ...loginStatus,
            loading: false,
            // @ts-ignore ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'.
            error: loginData.desc,
          }));
        } else {
          const nextUrl =
            !location.query.next || location.query.next === '/error' ? '/' : location.query.next;
          // @ts-ignore ts-migrate(2339) FIXME: Property 'token' does not exist on type 'Object'.
          //window.localStorage.setItem('token', loginData.token);
          window.location.href = decodeURIComponent(nextUrl);
        }
      },
  }),
  titleManager('Login'),
  pure(['location', 'info', 'loginStatus', 'username', 'password'])
)(Login);

import qs from 'qs';
import 'whatwg-fetch';
import RESOURCES from './resources';
import * as currentUserActions from './resources/currentUser/actions';
import * as logoutActions from './resources/logout/actions';
import {
  combineResourceActions,
  createApiActions,
  createResourceActions,
  fetchJson,
} from './utils';

export const DEFAULT_ACTIONS = {
  FETCH: {
    action: (url) => (params, id) => {
      let newUrl = url;

      if (id) {
        newUrl = `${url}/${id}`;
      }

      if (params) {
        const query = qs.stringify(params);
        newUrl = `${newUrl}?${query}`;
      }

      // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
      return fetchJson('GET', newUrl, params);
    },
    meta: (params, id) => ({ params, id }),
  },
  ACTION: {
    action: (url) => (params, id, urlParams) =>
      // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
      fetchJson('PUT', id ? `${url}/${id}` : `${url}/${urlParams || ''}`, params),
    meta: (params, id) => ({ params, id }),
  },
  BATCH_ACTION: {
    action:
      (url) =>
      (action, ids, query = '', params, key = 'ids') =>
        // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
        fetchJson('PUT', `${url}?action=${action}&${key}=${ids}&${query}`),
    meta: (action, ids, query, params) => ({ action, ids, query, params }),
  },
  UPDATE: {
    action: (url) => (params, id) =>
      // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
      fetchJson('POST', id ? `${url}/${id}` : url, params),
    meta: (params, id) => ({ params, id }),
  },
  REMOVE: {
    action: (url) => (params, id, urlParams) =>
      // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
      fetchJson('DELETE', id ? `${url}/${id}` : `${url}/${urlParams}`, params),
    meta: (params, id) => ({ params, id }),
  },
};

const actions: any = createApiActions(
  combineResourceActions(
    // @ts-ignore ts-migrate(2345) FIXME: Argument of type '{ FETCH: { action: (url: any) =>... Remove this comment to see the full error message
    createResourceActions(RESOURCES, DEFAULT_ACTIONS),
    createResourceActions(RESOURCES)
  )
);

// @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
Object.assign(actions.currentUser, currentUserActions);

// @ts-ignore ts-migrate(2339) FIXME: Property 'logout' does not exist on type '{}'.
Object.assign(actions.logout, logoutActions);

export default actions;

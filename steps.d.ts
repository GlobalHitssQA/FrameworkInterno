/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file.js');
type loginPage = typeof import('./pages/loginPage');
type PlaywrightVideoAllure = import('./utils/playwrightVideoAllure_helper');
type DbHelper = import('./node_modules/codeceptjs-dbhelper');
type ResembleHelper = import('codeceptjs-resemblehelper');
type ChaiWrapper = import('codeceptjs-chai');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any, loginPage: loginPage }
  interface Methods extends Playwright, PlaywrightVideoAllure, REST, GraphQL, JSONResponse, DbHelper, ResembleHelper, ChaiWrapper {}
  interface I extends ReturnType<steps_file>, WithTranslation<PlaywrightVideoAllure>, WithTranslation<GraphQL>, WithTranslation<JSONResponse>, WithTranslation<DbHelper>, WithTranslation<ResembleHelper>, WithTranslation<ChaiWrapper> {}
  namespace Translation {
    interface Actions {}
  }
}

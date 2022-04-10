import http from 'http';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import respond from 'koa-respond';
import routerApi from '../routes';

/**
 * Creates and returns a new Koa application.
 * Does *NOT* call `listen`!
 *
 * @return {Koa} The configured app.
 */
 export default async function createApiServer() {
 const api = new Koa();
 const server = http.createServer(api.callback());

 const router = new Router();
 router.use(routerApi.routes());

 api.use(
   respond({
     autoMessage: false
   })
 );

 api.use(
   bodyParser({
     enableTypes: ['json']
   })
 );

 api.use(router.routes()).use(router.allowedMethods());

 return { server, api };
}
/**
 * @fileOverview This module contains utility functions for accessing MCBKT
 *   engine of <a href="https://ukde.physicsfront.com">UKDE by Physics
 *   Front</a>.
 * @copyright (c) 2017, Sam Gweon (Sam@physicsfront.com)
 * @license <a href="https://opensource.org/licenses/BSD-3-Clause">
 *   BSD-3-Clause</a>
 * @author Sam Gweon (Sam@physicsfront.com)
 * @version 0.1.0
 * @module mcbkt-client
 */
"use strict";export function ajax_as_promise(url,method="GET",data,header){method=method.toUpperCase();return new Promise((resolve,reject)=>{const req=new XMLHttpRequest;req.open(method,url);req.onload=(()=>req.status===200?resolve(req.response):reject(Error(req.statusText)));req.onerror=(e=>reject(Error(`Network Error: ${e}`)));if(data){req.setRequestHeader("Content-Type","application/json;charset=UTF-8");data=JSON.stringify(data)}if(header!==undefined)for(const key in header)req.setRequestHeader(key,header[key]);req.send(data)})};export function post_scores_for_mcbkt_analysis(data,url="https://ukde.physicsfront.com/mcbkt/codapproxy_stub",header){return ajax_as_promise(url,"post",data,header)};export function post_logdata_for_mcbkt_analysis(logdata,url="https://ukde.physicsfront.com/logdata/codapproxy_stub",header){return ajax_as_promise(url,"post",logdata,header)};export default post_logdata_for_mcbkt_analysis;
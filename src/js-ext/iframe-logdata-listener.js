/**
 * @file This module is for listening to log data generated by CODAP, do
 *    stuff on log data, and then possibly pushing the result back into CODAP
 *    log stream.
 *    <p><i>Thanks are due to Doug Martin and Jonathan Sandoe</i> for their
 *    code of DataflowGettingStarted data-interactive, which gave some
 *    initial guideline and some hints to the code of this file.</p>
 *
 * @copyright (c) 2017, Physics Front LLC (main@physicsfront.com)
 * @license <a href="https://www.apache.org/licenses/LICENSE-2.0">
 *    Apache License, Version 2.0</a> (also, see file NOTICE).
 * @author Sam Gweon (Sam@physicsfront.com)
 * @version 0.1.0
 * @module iframe-logdata-listener
 */
"use strict";export function IFrameLogDataListener(iframePhone,logdata_callback,title="LListener",more_logdatum_fields={},verbosity=0){if(typeof title!=="string")throw Error("** The value of title must be a string.");title=title.trim();if(!title.length)throw Error("** The value of title cannot be an empty string.");if(typeof logdata_callback!=="function")throw Error("** The value of logdata_callback must be a function.");const client_id=title+"--"+(new Date).getTime()+"--"+Math.round(1e10*Math.random());const my_formatStr_prefix=client_id+":";let last_codap_response=null;let state={title:title,version:"0.1.0",preventBringToFront:false,dimensions:{width:500,height:500}};const _destroy=()=>{_unregister_for_logdata();connection.disconnect()};const _err_msg_for_unhandled_codap_request=request=>'Handler not implemented for action "'+request.action+'" for CODAP request with resource "'+request.resource+'".';const _err_msg_for_unhandled_codap_response=request=>'Handler not implemented for CODAP response to request "'+request.action+'" with resource "'+request.resource+'".';const _get_codap_request_handler=resource=>{let handler=_request_handler_registry[resource];if(handler===undefined)handler=(()=>{throw Error("No handler for CODAP request "+'with resource "'+resource+'".')});return handler};const _get_codap_response_handler=resource=>{let handler=_response_handler_registry[resource];if(handler===undefined)handler=(()=>{throw Error("No handler for "+'CODAP response to request with resource "'+resource+'".')});return handler};const _register_for_logdata=()=>{send_request_to_codap({action:"register",resource:"logMessageMonitor",values:{clientId:client_id,message:"*"}})};const _request_handler_registry={interactiveState:request=>{switch(request.action){case"get":return this.get_state();default:throw Error(_err_msg_for_unhandled_codap_request(request))}},logMessageNotice:request=>{let json_data=request.values;switch(request.action){case"notify":if(json_data.formatStr.startsWith(my_formatStr_prefix)){if(verbosity>=1)console.log("== got boomeranged logdata: "+JSON.stringify(json_data))}else{if(json_data.logMonitor&&client_id==json_data.logMonitor.clientId){delete json_data.logMonitor;json_data.iframe_logdata_client_id=client_id;json_data.time=(new Date).getTime()*.001;for(const key in more_logdatum_fields)if(json_data[key]===undefined)json_data[key]=more_logdatum_fields[key];logdata_callback(json_data,logdata_report_callback)}}return{message:"logdatum was received"};default:throw Error(_err_msg_for_unhandled_codap_request(request))}}};const _response_handler_registry={interactiveFrame:(request,response)=>{switch(request.action){case"get":{let frame_data=response.values;if(frame_data.savedState)set_state(frame_data.savedState,false);set_state(frame_data);if(verbosity>=1)console.log('== codap response for "get" '+"interactiveFrame = "+JSON.stringify(response));state._got_codap=true}return;default:throw Error(_err_msg_for_unhandled_codap_response(request))}},logMessage:request=>{switch(request.action){case"notify":if(verbosity>=1)console.log("log data were recevied well by CODAP---but "+"only formatStr and replaceArgs, I think.");return;default:throw Error(_err_msg_for_unhandled_codap_response(request))}},logMessageMonitor:request=>{switch(request.action){case"register":if(verbosity>=1)console.log("== got register data: "+JSON.stringify(request.values));return;default:throw Error(_err_msg_for_unhandled_codap_request(request))}}};const _unregister_for_logdata=()=>{send_request_to_codap({action:"unregister",resource:"logMessageMonitor",values:{clientId:client_id}})};const handle_codap_request=(request,callback)=>{if(verbosity>=1)console.log("== handle_codap_request: "+JSON.stringify(request));let success=false,values=null;try{values=_get_codap_request_handler(request.resource)(request);success=true}catch(error){console.log("** _get_codap_request_handler failed: "+error.message)}callback({success:success,values:values})};const handle_codap_response=(request,response)=>{if(verbosity>=1)console.log("== handle_codap_response: "+JSON.stringify(response));last_codap_response=response;if(!response){console.log("** Request to CODAP seems to have gotten no response: "+JSON.stringify(request))}else if(Array.isArray(response)){if(!Array.isArray(request))throw Error("Type mismatch between request (non-Array) and "+"response (Array).");if(response.length!=request.length)throw Error("Length mismatch between request ("+request.length+") and response ("+response.length+").");request.forEach((rq,i_rq)=>handle_codap_response(rq,response[i_rq]))}else if(response.success){if(verbosity>=1)console.log("== Request to CODAP succeeded: "+JSON.stringify(request));try{_get_codap_response_handler(request.resource)(request,response)}catch(error){console.log("** _get_codap_response_handler failed: "+error.message)}}else{const msg="** Request to CODAP failed: "+JSON.stringify(request);console.log(msg);alert(msg)}};const logdata_report_callback=report=>{if(verbosity>=1)console.log("== GOT report back! "+JSON.stringify(report));if(report.formatStr===undefined)report.formatStr=title+" report";if(verbosity>=1)console.log("== pushing logdata to CODAP: "+JSON.stringify(report));send_request_to_codap({action:"notify",resource:"logMessage",values:report})};const send_request_to_codap=(req,opts)=>{if(req.resource==="logMessage"&&req.action==="notify"){if(req.values===undefined)req.values={};req.values.formatStr=my_formatStr_prefix+req.values.formatStr}connection.call(req,response=>handle_codap_response(req,response,opts))};const set_state=(state_in,strict=true)=>{if(strict)for(const key in state){const val=state_in[key];if(val!==undefined)state[key]=val}else for(const key in state_in)state[key]=state_in[key]};this.get_state=((no_priv=true)=>{let ans={};if(no_priv){for(const key in state)if(!key.startsWith("_"))ans[key]=state[key]}else for(const key in state)ans[key]=state[key];return ans});this.update_iframe_state=(()=>{send_request_to_codap({action:"update",resource:"interactiveFrame",values:state})});const connection=new iframePhone.IframePhoneRpcEndpoint(handle_codap_request,"data-interactive",window.parent);send_request_to_codap({action:"get",resource:"interactiveFrame"});_register_for_logdata();window.unload=_destroy};export default IFrameLogDataListener;
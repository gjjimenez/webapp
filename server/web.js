import fs      from 'fs'
import http    from 'http'
import https   from 'https'
import restify from 'restify'
import os      from 'os'
import log     from './log'
import configuration from './configuration'

// http://mcavage.me/node-restify/
const web = restify.createServer
({
	// certificate: ...
	// key: ...
	name: 'cinema',
	log: log
})

// global.web = web

web.pre(restify.pre.userAgentConnection())

// Api

import json_rpc from './libraries/json rpc'

// json_rpc = () => Json_rpc.create.apply(this, arguments)
// global.json_rpc = json_rpc

import utility from './api/utility'

// serve_api('auth')
json_rpc.add('utility', utility)

// Force Https

// app.get '*', (request, response, next) ->

// попробовать можно: request.isSecure()

// 	host = request.get('host')
// 	if host.has(':')
// 		host = host.before(':')

// 	host_port = host
// 	if configuration.webserver.https.port != 443
// 		host_port += ":#{configuration.webserver.https.port}"

// 	if not request.connection.encrypted
// 		response.redirect("https://#{host_port}#{request.url}")
// 	else
// 		next()

web.use(restify.acceptParser(web.acceptable))
web.use(restify.authorizationParser())
web.use(restify.dateParser())
web.use(restify.queryParser())
web.use(restify.jsonp())
web.use(restify.gzipResponse())
web.use(restify.bodyParser({
	maxBodySize: 0,
	mapParams: true,
	mapFiles: false,
	// overrideParams: false
	// multipartHandler: (part) ->
	// 	part.on 'data', (data) ->
	// 		// do something with the multipart data
	// multipartFileHandler: (part) ->
	// 	part.on 'data', (data) ->
	// 		// do something with the multipart file data
	// keepExtensions: false
	uploadDir: os.tmpdir(),
	multiples: true
}))

web.use((request, response, next) =>
{
	request.parameters = request.params
	next()
})
	
web.use(restify.CORS({
	// origins: ['https://foo.com', 'http://bar.com', 'http://baz.com:8081'],   // defaults to ['*']
	// credentials: true,                 // defaults to false
	// headers: ['x-foo']                 // sets expose-headers
}))

// busboy is supposed to be better than formidable
// app.use(require('connect-busboy')({ highWaterMark: 10 * 1024 * 1024, limits: { fileSize: 100 * 1024 * 1024 } }))

for (let method of ['get', 'post', 'put', 'delete', 'head'])
{
	// (method => 
	// {
	const method_function = web[method]
	web[method] = function(path, handler)
	{
		const simpler_handler = handler
		handler = (request, response, next) =>
		{
			let next_explicitly_called = false
			self_detecting_next = () =>
			{
				next_explicitly_called = true
				next.apply(this, arguments)
			}

			simpler_handler(request, response, self_detecting_next)

			if (!next_explicitly_called) {
				self_detecting_next()
			}
		}

		method_function.apply(this, arguments)
	}
	// })(method)
}

import socket_io from 'socket.io'
// websocket.path('/websocket.io')
const websocket = socket_io.listen(web.server) // (web)

websocket.serveClient(false)

const api = websocket.of('/api')
api.on('connection', socket =>
{
	socket.on('call', request =>
	{
		json_rpc.process(request).then(response =>
		{
			socket.emit('return', response)
		})
	})
})

// routes
// require('./rest api')

// app.get '/lib/ace-builds/src-min/theme-jsoneditor.js', (request, response) ->
// 	response.sendfile(Root_folder + '/public/lib/jsoneditor/asset/ace/theme-jsoneditor.js')

// https_options = 
// 	key  : fs.readFileSync("#{Root_folder}/#{configuration.webserver.https.private_key}")
// 	cert : fs.readFileSync("#{Root_folder}/#{configuration.webserver.https.certificate}")

// http.createServer(app).listen(configuration.webserver.http.port)
// https.createServer(https_options, app).listen(configuration.webserver.https.port)

// web.get /.*/, ->
// 	restify.serveStatic({
// 		directory: "#{Root_folder}/build/client"
// 		default: 'index.html'
// 	})

import React from 'react'

web.get('/react', (request, response) =>
{
	// здесь будет серверный рендеринг
	// html = React.renderToStaticMarkup(body(null))
})

web.listen(configuration.webserver.http.port, () =>
{
	// log.info "web server listening at #{web.url}"
	// log.info "socket.io server listening at #{web.url}"
})

export default web
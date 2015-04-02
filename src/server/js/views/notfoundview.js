function display(response, args, postData) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error: Page not found.');
	response.end();
}

exports.display = display
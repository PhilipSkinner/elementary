const idmService = function(request, hostnameResolver) {
	this.request 			= request;
	this.authClientProvider = null;
	this.hostnameResolver 	= hostnameResolver;
};

idmService.prototype.setAuthClientProvider = function(authClientProvider) {
	this.authClientProvider = authClientProvider;
};

idmService.prototype._getToken = function(authToken) {
	return new Promise((resolve, reject) => {
		if (authToken) {
			return resolve(authToken);
		}

		if (this.authClientProvider) {
			return this.authClientProvider.getAccessToken().then((token) => {
				return resolve(token);
			}).catch(reject);
		}

		return resolve("");
	});
};

idmService.prototype.getUsers = function(authToken) {
	return this._getToken(authToken).then((token) => {
		return new Promise((resolve, reject) => {
			this.request.get(`${this.hostnameResolver.resolveIdentity()}/api/users`, {
				headers : {
					Authorization 	: `Bearer ${token}`,
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode === 200) {
					try {
						return resolve(JSON.parse(body));
					} catch(e) {
						return reject(new Error("Invalid JSON response"));
					}
				}

				return reject(new Error(`Invalid status code received - ${res.statusCode}`));
			});
		});
	});
};

idmService.prototype.registerUser = function(user, authToken) {
	return this._getToken(authToken).then((token) => {
		return new Promise((resolve, reject) => {
			this.request.post(`${this.hostnameResolver.resolveIdentity()}/api/users`, {
				body : JSON.stringify(user),
				headers : {
					Authorization 	: `Bearer ${token}`,
					"content-type" 	: "application/json"
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode === 201) {
					let id = null;
					try {
						id = res.headers.location.split('/').slice(-1)[0];
					} catch(e) {
						return reject(new Error(`Could not parse location header`));
					}

					return this.getUser(id, authToken).then(resolve).catch(reject);
				}

				return reject(new Error(`Invalid status code received - ${res.statusCode}`));
			});
		});
	});
};

idmService.prototype.getUser = function(user, authToken) {
	return this._getToken(authToken).then((token) => {
		return new Promise((resolve, reject) => {
			this.request.get(`${this.hostnameResolver.resolveIdentity()}/api/users/${user}`, {
				headers : {
					Authorization : `Bearer ${token}`
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode === 200) {
					try {
						return resolve(JSON.parse(body));
					} catch(e) {
						return reject(new Error("Invalid JSON response"));
					}
				}

				return reject(new Error(`Invalid status code received - ${res.statusCode}`));
			});
		});
	});
};

idmService.prototype.updateUser = function(username, password, claims, authToken) {
	return this._getToken(authToken).then((token) => {
		return new Promise((resolve, reject) => {
			this.request.put(`${this.hostnameResolver.resolveIdentity()}/api/users/${username}`, {
				body : JSON.stringify({
					username 	: username,
					password 	: password,
					claims 		: claims || {}
				}),
				headers : {
					Authorization : `Bearer ${token}`,
					"content-type" : "application/json"
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode === 204) {
					return resolve();
				}

				return reject(new Error(`Invalid status code received - ${res.statusCode}`));
			});
		});
	})
};

module.exports = function(request, hostnameResolver) {
	if (!request) {
		request = require("request");
	}

	if (!hostnameResolver) {
		hostnameResolver = require("./hostnameResolver")();
	}

	return new idmService(request, hostnameResolver);
};

class VersionManager {

	constructor() {
		this.appVersion = "1.0.0";
		this.storedVersion = undefined;
		this.updateDescription = [];
	}

	checkVersionUpdate() {
		return new Promise((resolve, reject) => {
			this.getVersions().then(() => {
				let displayUpdate = false;
				if (this.storedVersion === undefined) {
					// we simply store the current version, and we do not need to display any alert to the user
					localStorage.setItem('version', this.appVersion)
				} else {
					// we compare if the stored version matches the current version of the app
					if (this.storedVersion !== this.appVersion) {
						// we update the stored version and display an overlay to the user with the new features
						localStorage.setItem('version', this.appVersion)
						displayUpdate = true;
					}
				}
				resolve(displayUpdate);
			})
		});
	}

	getUpdateDescription() {
		// fetch all the items that were added since last version was stored
		return this.updateDescription;
	}

	getVersions = () => {
		let promise = new Promise((resolve, reject) => {
			this.fetchVersions().then(versions => {
				this.storedVersion = this.fetchStoredVersion();
				let updateArray = [];
				for (var version in versions) {
					if (version <= this.appVersion && version > this.storedVersion) {
						for (var k = 0; k < versions[version].length; k++) {
							updateArray.push(versions[version][k]);
						}
					}
				}
				this.updateDescription = updateArray
				resolve(true);
			})
		});

		return promise;
	}

	fetchConfig() {
		/**
			This method fetches the config json file and returns a promise that resolves with the config file.
		*/

		return new Promise(resolve => {
			fetch('config.json').then(response => {
	            return response.json();
	        }).then(json => {
	        	resolve(json);
	        })
	    });
	}

	fetchVersions() {
		return this.fetchConfig().then(json => {
			let versions = json.versions;
			return versions
		});
	}


	fetchStoredVersion() {
		if (this.storageAvailable('localStorage')) {
			if (localStorage.getItem('version')) {
				// there is already a version stored in the browser storage, so we will check if it needs to be updated
				return localStorage.getItem('version')
			} 
		} else {
		  console.log("Local storage not available")
		}
	}

	storageAvailable(type) {
	    var storage;
	    try {
	        storage = window[type];
	        var x = '__storage_test__';
	        storage.setItem(x, x);
	        storage.removeItem(x);
	        return true;
	    }
	    catch(e) {
	        return e instanceof DOMException && (
	            // everything except Firefox
	            e.code === 22 ||
	            // Firefox
	            e.code === 1014 ||
	            // test name field too, because code might not be present
	            // everything except Firefox
	            e.name === 'QuotaExceededError' ||
	            // Firefox
	            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
	            // acknowledge QuotaExceededError only if there's something already stored
	            (storage && storage.length !== 0);
	    }
	}

}

export default VersionManager;
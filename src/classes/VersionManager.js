import Utils from './Utils.js';

class VersionManager {

	constructor() {
		this.appVersion = {"major":1, "minor":1, "patch":0};
		this.storedVersion = undefined;
		this.updateDescription = [];
	}

	checkVersionUpdate() {
		return new Promise((resolve, reject) => {
			this.getVersions().then(() => {
				let displayUpdate = false;
				if (this.storedVersion === undefined) {
					// we simply store the current version, and we do not need to display any alert to the user
					localStorage.setItem('version', JSON.stringify(this.appVersion))
				} else {
					// we compare if the stored version matches the current version of the app
					// in this case we only consider the versio "upgrade", i.e we do not want the user to access a lower version
					if (Utils.compareVersions(this.storedVersion, this.appVersion) === 'lower') {
						// we update the stored version and display an overlay to the user with the new features
						localStorage.setItem('version', JSON.stringify(this.appVersion))
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
					let compareVersionToApp = Utils.compareVersions(Utils.versionStringToObject(version), this.appVersion);
					let compareVersionToStored = Utils.compareVersions(Utils.versionStringToObject(version), this.storedVersion);
					// version comparison - if the version of the config file is lower or equal to the app version, and higher than the stored
					// version, then it means that there was a version update and we want to list all the delta features added
					if ((compareVersionToApp === 'lower' || compareVersionToApp === 'equal') && compareVersionToStored === 'higher') {
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
		if (Utils.storageAvailable('localStorage')) {
			if (localStorage.getItem('version')) {
				// there is already a version stored in the browser storage, so we will check if it needs to be updated
				return JSON.parse(localStorage.getItem('version'))
			}
		} else {
		  console.log("Local storage not available")
		}
	}

}

export default VersionManager;
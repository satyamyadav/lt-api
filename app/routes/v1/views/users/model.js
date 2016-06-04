var _ = require('lodash');

module.exports = function (view, user, reviewsCount) {

		var userPic;
		if (user.imported_data && _.isObject(user.imported_data)) {
				if(user.imported_data.facebook) {
						userPic = user.imported_data.facebook.picture;
				} else if (user.imported_data.google) {
						userPic = user.imported_data.google.picture;
				} else {
					userPic = user.imported_data.avatar;
				}
				user.picture = userPic;
		} else if (!_.isUndefined(user.details.image_urls) && user.details.image_urls.length > 0 ) {
			user.picture = user.details.image_urls[0];
		} else {
			user.picture = null;
		}

		if (_.isUndefined(user.details) || !(user.details)) {
				user.details = {};
		};

		var o = {
				data: _.omit(user, [
						'facebook_id',
						'twitter_id',
						'github_id',
						'googleplus_id',
						'plain_password',
						'password',
						'__table'
				])
		};

		return o;
};
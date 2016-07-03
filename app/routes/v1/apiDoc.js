/**
 * @api {get} /users Read list of a Users
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup Users
 * @apiPermission public
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3030/users
 *
 * @apiSuccess {Object}   data          an object ({data:[array of user objects]}).
 * @apiSuccess {Object[]} data.data     array of user objects
 *
 */



/**
 * @api {get} /users/:id Read data of a User
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup Users
 * @apiPermission public
 *
 *
 * @apiParam {Number} id The Users-ID.
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3030/users/4
 *
 * @apiSuccess {Number}   id            The Users-ID.
 * @apiSuccess {String}   username      username.
 * @apiSuccess {String}   email         email.
 * @apiSuccess {String}   full_name     Fullname of the User.
 * @apiSuccess {Object}   details       details data
 * @apiSuccess {Object}   user_location location data
 * @apiSuccess {Object}   imported_data social data
 * @apiSuccess {Object}   social_accounts Profile data
 * @apiSuccess {Number}   details.age   Users age.
 * @apiSuccess {String}   details.gender Users gender.
 * @apiSuccess {Object[]} followers       List of Users followers (Array of Objects).
 * @apiSuccess {String}   followers.user_id  id of user.
 * @apiSuccess {String}   followers.follow_id id of follower.
 *
 * @apiError UserNotFound   The <code>id</code> of the User was not found.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "error": "NoAccessRight"
 *     }
 */


 /**
  * @api {get} /projects Read list of a projects
  * @apiVersion 1.0.0
  * @apiName GetProjects
  * @apiGroup Projects
  * @apiPermission public
  *
  * @apiExample Example usage:
  * curl -i http://localhost:3030/projects
  *
  * @apiSuccess {Object}   data          an object ({data:[array of project objects]}).
  * @apiSuccess {Object[]} data.data     array of projects objects
  *
  */

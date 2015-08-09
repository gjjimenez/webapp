const initial_state =
{
	loaded: false
}

const handlers =
{
}

export default function(state = initial_state, action = {})
{
	const handler = handlers[action.type]

	if (!handler)
	{
		return state
	}

	return handler(state, action)
}

// export default function info(state = initial_state, action = {}) {
// 	switch (action.type) {
// 		case AUTH_LOAD:
// 			return {
// 				...state,
// 				loading: true
// 			};
// 		case AUTH_LOAD_SUCCESS:
// 			return {
// 				...state,
// 				loading: false,
// 				loaded: true,
// 				user: action.result
// 			};
// 		case AUTH_LOAD_FAIL:
// 			return {
// 				...state,
// 				loading: false,
// 				loaded: false,
// 				error: action.error
// 			};
// 		case AUTH_LOGIN:
// 			return {
// 				...state,
// 				loggingIn: true
// 			};
// 		case AUTH_LOGIN_SUCCESS:
// 			return {
// 				...state,
// 				loggingIn: false,
// 				user: action.result
// 			};
// 		case AUTH_LOGIN_FAIL:
// 			return {
// 				...state,
// 				loggingIn: false,
// 				user: null,
// 				loginError: action.error
// 			};
// 		case AUTH_LOGOUT:
// 			return {
// 				...state,
// 				loggingOut: true
// 			};
// 		case AUTH_LOGOUT_SUCCESS:
// 			return {
// 				...state,
// 				loggingOut: false,
// 				user: null
// 			};
// 		case AUTH_LOGOUT_FAIL:
// 			return {
// 				...state,
// 				loggingOut: false,
// 				logoutError: action.error
// 			};
// 		default:
// 			return state;
// 	}
// }
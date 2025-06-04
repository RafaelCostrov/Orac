import { GoogleLogin } from "@react-oauth/google";

<GoogleLogin
	onSuccess={credentialResponse => {
		console.log(credentialResponse);
	}}
	onError={() => {
		console.log("Login Failed");
	}}
	useOneTap
/>;

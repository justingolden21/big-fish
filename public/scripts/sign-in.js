let user, signedIn = false;

// https://firebase.google.com/docs/auth/web/google-signin
function signin() {
	let provider = new firebase.auth.GoogleAuthProvider();

	firebase.auth().signInWithPopup(provider).then( (result)=> {
		let token = result.credential.accessToken;

		user = result.user;

		showProfileInfo(user.displayName, user.photoURL);

		$('#sign-in-btn').addClass('hidden');
		$('#sign-out-btn').removeClass('hidden');
		$('#toast').html('');

		signedIn = true;

		getScores();
	}).catch( (err)=> {
		console.log('Sign-in error', err);

		$('#toast').html('error signing in');
		setTimeout(()=> $('#toast').html(''),3000);
	});
}
function signout() {
	firebase.auth().signOut().then( ()=> {
		$('#sign-in-btn').removeClass('hidden');
		$('#sign-out-btn').addClass('hidden');
		$('#toast').html('sign-out successful');
		setTimeout(()=> $('#toast').html(''),3000);

		hideProfileInfo();

		console.log('Sign-out successful');

		signedIn = false;

	}).catch( (err)=> {
		$('#toast').html('sign-out error');
		setTimeout(()=> $('#toast').html(''),3000);

		console.log('Sign-out error', err);
	});
}

function showProfileInfo(name, src) {
	$('#profile-name').html(name).removeClass('hidden');
	$('#profile-img').prop('src', src).removeClass('hidden');
}
function hideProfileInfo() {
	$('#profile-name').html('').addClass('hidden');
	$('#profile-img').prop('src', '').addClass('hidden');
}
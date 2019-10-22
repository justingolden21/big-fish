firebase.initializeApp({
	// apiKey: '### FIREBASE API KEY ###',
	apiKey: 'AIzaSyDot0cJN83Fpy0EPIuyn8eQxlJUPK-Lxfs',
	// authDomain: '### FIREBASE AUTH DOMAIN ###',
	authDomain: 'big-fish-game.firebaseapp.com',
	// projectId: '### CLOUD FUNCTIONS PROJECT ID ###',
	projectId: 'big-fish-game',
	// databaseURL: 'https://### YOUR DATABASE NAME ###.firebaseio.com'
	databaseURL: 'https://big-fish-game.firebaseio.com/'
});

// Initialize Cloud Functions through Firebase
let functions = firebase.functions();

console.log(functions);

// https://console.developers.google.com/apis/credentials?project=big-fish-game
// https://firebase.google.com/docs/functions/callable
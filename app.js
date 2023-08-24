
const universitiesURL = "http://universities.hipolabs.com/search?country=United+kingdom";

checkSaved()

async function checkSaved(){
	document.getElementById("saved").innerHTML = "";
	const unis = JSON.parse(localStorage.getItem('universities')) || [];
	if(unis !== []){
		const results = await(await fetch(universitiesURL)).json();
		const foundUniversities = results.filter(item => unis.includes(item.name));
		const uniqueUniversities = Array.from(new Set(foundUniversities.map(a => a.name)))
			.map(name => {
				return foundUniversities.find(a => a.name === name)
			})

		uniqueUniversities.forEach(
			uni => 
				document.getElementById("saved").innerHTML += formatUniversity(uni)
		);

	}
}

async function search(event){

	const searchTerm = event.target.value;

	if (searchTerm === '') {
		displayUniversities([]);
		return;
	}

	const results = await (await fetch(universitiesURL)).json()

	const searchTermCaptalised = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);

	const foundUniversities = results.filter(item => item.name.includes(searchTermCaptalised) || item.name.includes(searchTerm));
	const uniqueUniversities = Array.from(new Set(foundUniversities.map(a => a.name)))
		.map(name => {
			return foundUniversities.find(a => a.name === name)
		})
	displayUniversities(uniqueUniversities.slice(0, 20))
}



function displayUniversities(foundUniversities){
	document.getElementById("results").innerHTML = foundUniversities.map(formatUniversity).join("");
}

function formatUniversity(university){
	let domains = ``;
	
	university.domains.forEach(element => domains += `<a class='box m-1' href='https://${element}'>${element}</a>`);

	console.log(isSaved(university));

	if (isSaved(university)) {
		return `
			<div class="card p-1 m-1 is-one-quarter column level-item">
				<div class="card-header">
					<div class="card-header-title">${university.name}</div>
				</div>
				<div class="card-content p-4">${university.country}</div>
				${domains}
				<footer class="card-footer">
					<a onclick="deleteUniversity('${university.name}')" class="card-footer-item"><i class="fa-solid fa-trash p-2"></i>Delete</a>
				</footer>
			</div>
		`
	}

	return `
		<div class="card p-1 m-1 is-one-quarter column level-item">
			<div class="card-header">
				<div class="card-header-title">${university.name}</div>
			</div>
			<div class="card-content p-4">${university.country}</div>
			${domains}
			<footer class="card-footer">
				<a onclick="saveUniversity('${university.name}')" class="card-footer-item"><i class="fa-solid fa-save p-2"></i>Save</a>
				<a onclick="deleteUniversity('${university.name}')" class="card-footer-item"><i class="fa-solid fa-trash p-2"></i>Delete</a>
			</footer>
		</div>
	`
}

function isSaved(university) {
	const unis = JSON.parse(localStorage.getItem('universities')) || [];
	if (unis.includes(university.name)) {
		return true;
	}
	return false;
}

function saveUniversity(university){
	const unis = JSON.parse(localStorage.getItem('universities')) || [];
	if (!unis.includes(university)) { 
		const data = [unis, ...[university]].flat(Infinity);
		localStorage.setItem('universities', JSON.stringify(data));
	}
}

function deleteUniversity(university){
	const unis = JSON.parse(localStorage.getItem('universities')) || [];
	const removed = unis.filter(uni => uni !== university);
	localStorage.setItem('universities', JSON.stringify(removed));
	checkSaved();
}

document.getElementById("header").innerHTML = "<div class='container p-4'><span class='has-text-weight-bold'>NSN</span></div>"

document.getElementById("footer").innerHTML = `
<span class='p-4 has-text-white-ter is-pulled-left'> NSN</span>
<div class='p-4 has-background-grey-dark has-text-white-ter is-full is-pulled-right'>
<a href=/><i class="fa-solid fa-house"></i> Home</a>
<a href=/><i class="fa-solid fa-shield"></i> Privacy</a>
<a href=/><i class="fa-solid fa-file-contract"></i> Terms</a>
<a href=/><i class="fa-solid fa-address-card"></i> Contact</a>

</div>`
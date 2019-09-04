function searchTerm(e){
    document.getElementById('searchTerm').value
    e.preventDefault()
}

const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', searchTerm)
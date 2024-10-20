async function categoryDropdown() {

    const response = await fetch('https://opentdb.com/api_category.php');
    const data = await response.json();
    const categories = data.trivia_categories;

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        document.getElementById('category-select').appendChild(option);
    });
}
categoryDropdown();


document.getElementById('fetch-questions').addEventListener('click', async () => {
    const selectedCategory = document.getElementById('category-select').value;
    if (!selectedCategory) {
        alert('Please select a category.');
        return;
    }
    localStorage.setItem('selectedCategory', selectedCategory);

    window.location.href = 'quiz.html';
});


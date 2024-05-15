const ACCESS_KEY = "DOWbWUH7ueBt_no7P8kpxmYoxOJKjUBNBkJDN70rKnQ";

window.onload = function () {
    axios.get('https://api.unsplash.com/photos', {
        params: {
            client_id: ACCESS_KEY,
            page: Math.floor(Math.random() * 10)
        }
    })
        .then(function (response) {
            const images = response.data.map(item => {
                const keys = Object.keys(item.urls);
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                return item.urls[randomKey];
            });
            const photoGrid = document.querySelector('.photo-grid');
            photoGrid.innerHTML = ''; // Clear existing content

            images.forEach(imageUrl => {
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.setAttribute('lazy-src', imageUrl);
                li.appendChild(img);
                photoGrid.appendChild(li);
            });
            ready();
        })
        .catch(function (error) {
            alert('Error fetching data');
        });
};

document.getElementById('search-button').addEventListener('click', function () {
    const query = document.getElementById('search-input').value;
    fetchImages(query);
});

document.querySelectorAll('.hot-search button').forEach(function (button) {
    button.addEventListener('click', function () {
        fetchImages(this.textContent);
    });
});

function fetchImages(query) {
    axios.get('https://api.unsplash.com/search/photos', {
        params: {
            query: query,
            client_id: ACCESS_KEY,
            page: 1
        }
    })
        .then(function (response) {
            const images = response.data.results.map(result => {
                const keys = Object.keys(result.urls);
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                return result.urls[randomKey];
            });
            const photoGrid = document.querySelector('.photo-grid');
            photoGrid.innerHTML = ''; // Clear existing content

            images.forEach(imageUrl => {
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.setAttribute('lazy-src', imageUrl);
                li.appendChild(img);
                photoGrid.appendChild(li);
            });
            ready();
        })
        .catch(function (error) {
            alert('Error fetching data');
        });
}

function ready() {
    if ('IntersectionObserver' in window) {
        let lazyImgs = document.querySelectorAll('[lazy-src]');
        let observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                load(entry.target);
            }
        }));

        lazyImgs.forEach(img => {
            observer.observe(img);
        });
    } else {
        // use getBoundingClientRect()
        var lazyImgs = document.querySelectorAll('[lazy-src]');
        window.addEventListener('scroll', function () {
            lazyImgs.forEach(img => {
                if (img.parentElement.getBoundingClientRect().top <= window.innerHeight && img.parentElement.getBoundingClientRect().bottom >= 0) {
                    load(img);
                }
            });
        });

        // Check on initial load in case images are in viewport without scrolling
        lazyImgs.forEach(img => {
            if (img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0) {
                load(img);
            }
        });
    }
}

function load(img) {
    const url = img.getAttribute('lazy-src');
    
    img.setAttribute('src', url);
    // img.removeAttribute('lazy-src');
}


var input = document.getElementById('search-input');
var clearButton = document.querySelector('.input-container button');

input.addEventListener('input', function () {
    // Check if there is text in the input
    if (input.value.length > 0) {
        clearButton.style.display = 'block'; // Show button
    } else {
        clearButton.style.display = 'none'; // Hide button
    }
});

input.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        fetchImages(event.target.value);
    }
});

clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    input.value = '';
    clearButton.style.display = 'none'; // Hide button
    input.focus();
});
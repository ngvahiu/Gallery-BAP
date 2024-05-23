"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ACCESS_KEY = "DOWbWUH7ueBt_no7P8kpxmYoxOJKjUBNBkJDN70rKnQ";
const searchBtn = document.getElementById('search-button');
const photoGrid = document.querySelector('.photo-grid');
function fetchImages() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://api.unsplash.com/photos?' + new URLSearchParams({
            client_id: ACCESS_KEY,
            page: String(Math.floor(Math.random() * 10))
        }));
        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        const data = yield response.json();
        return data.map((item) => {
            const keys = Object.keys(item.urls);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            return item.urls[randomKey];
        });
    });
}
function searchImages(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://api.unsplash.com/search/photos?' + new URLSearchParams({
            query: query,
            client_id: ACCESS_KEY,
            page: '1'
        }), {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        const data = yield response.json();
        return data.results.map((item) => {
            const keys = Object.keys(item.urls);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            return item.urls[randomKey];
        });
    });
}
function ready() {
    if ('IntersectionObserver' in window) {
        let lazyImgs = Array.from(document.querySelectorAll('[lazy-src]'));
        let observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                load(entry.target);
            }
        }));
        lazyImgs.forEach((img) => {
            observer.observe(img);
        });
    }
    else {
        let lazyImgs = Array.from(document.querySelectorAll('[lazy-src]'));
        window.addEventListener('scroll', function () {
            lazyImgs.forEach((img) => {
                if (img && img.parentElement && img.parentElement.getBoundingClientRect().top <= window.innerHeight && img.parentElement.getBoundingClientRect().bottom >= 0) {
                    load(img);
                }
            });
        });
        lazyImgs.forEach((img) => {
            if (img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0) {
                load(img);
            }
        });
    }
}
function load(img) {
    const url = img.getAttribute('lazy-src');
    img.setAttribute('src', url);
}
function attachImagesToGrid(images) {
    photoGrid.innerHTML = '';
    images.forEach((imageUrl) => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.setAttribute('lazy-src', imageUrl);
        li.appendChild(img);
        photoGrid.appendChild(li);
    });
    ready();
}
window.onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        fetchImages()
            .then((images) => {
            attachImagesToGrid(images);
        })
            .catch((error) => {
            alert(error.message);
        });
    });
};
searchBtn.addEventListener('click', function () {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value;
    if (query) {
        searchImages(query)
            .then((images) => {
            attachImagesToGrid(images);
        })
            .catch((error) => {
            alert(error.message);
        });
    }
});
document.querySelectorAll('.hot-search button').forEach(function (button) {
    button.addEventListener('click', function () {
        if (this.textContent) {
            searchImages(this.textContent)
                .then((images) => {
                attachImagesToGrid(images);
            })
                .catch((error) => {
                alert(error.message);
            });
        }
    });
});
let input = document.getElementById('search-input');
let clearButton = document.querySelector('.input-container button');
input.addEventListener('input', function () {
    if (input.value.length > 0) {
        clearButton.style.display = 'block';
    }
    else {
        clearButton.style.display = 'none';
    }
});
input.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const target = event.target;
        if (target && target.value) {
            searchImages(target.value)
                .then((images) => {
                attachImagesToGrid(images);
            })
                .catch((error) => {
                alert(error.message);
            });
        }
    }
});
clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    input.value = '';
    clearButton.style.display = 'none';
    input.focus();
});

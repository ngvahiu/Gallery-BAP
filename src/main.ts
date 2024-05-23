const ACCESS_KEY: string = "DOWbWUH7ueBt_no7P8kpxmYoxOJKjUBNBkJDN70rKnQ";
const searchBtn: HTMLButtonElement = document.getElementById('search-button') as HTMLButtonElement;
const photoGrid: HTMLUListElement = document.querySelector('.photo-grid') as HTMLUListElement;

async function fetchImages(): Promise<string[]> {
    const response = await fetch('https://api.unsplash.com/photos?' + new URLSearchParams({
        client_id: ACCESS_KEY,
        page: String(Math.floor(Math.random() * 10))
    }));

    if (!response.ok) {
        throw new Error("Error fetching data");
    }

    const data: Response[] = await response.json();
    return data.map((item: any) => {
        const keys: string[] = Object.keys(item.urls);
        const randomKey: string = keys[Math.floor(Math.random() * keys.length)];
        return item.urls[randomKey];
    });
}

async function searchImages(query: string): Promise<string[]> {
    const response = await fetch('https://api.unsplash.com/search/photos?' + new URLSearchParams({
        query: query,
        client_id: ACCESS_KEY,
        page: '1'
    }), {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error("Error fetching data");
    }

    const data: any = await response.json();
    return data.results.map((item: any) => {
        const keys: string[] = Object.keys(item.urls);
        const randomKey: string = keys[Math.floor(Math.random() * keys.length)];
        return item.urls[randomKey];
    });
}

function ready(): void {
    if ('IntersectionObserver' in window) {
        let lazyImgs: HTMLImageElement[] | [] = Array.from(document.querySelectorAll('[lazy-src]')) as HTMLImageElement[];
        let observer: any = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                load((entry.target as HTMLImageElement));
            }
        }));

        lazyImgs.forEach((img: HTMLImageElement) => {
            observer.observe(img);
        });
    } else {
        // use getBoundingClientRect()
        let lazyImgs: HTMLImageElement[] = Array.from(document.querySelectorAll('[lazy-src]')) as HTMLImageElement[];
        (window as Window).addEventListener('scroll', function () {
            lazyImgs.forEach((img: HTMLImageElement) => {
                if (img && img.parentElement && img.parentElement.getBoundingClientRect().top <= window.innerHeight && img.parentElement.getBoundingClientRect().bottom >= 0) {
                    load(img);
                }
            });
        });

        // Check on initial load in case images are in viewport without scrolling
        lazyImgs.forEach((img: HTMLImageElement) => {
            if (img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0) {
                load(img);
            }
        });
    }
}

function load(img: HTMLImageElement) {
    const url: string | null = img.getAttribute('lazy-src');
    img.setAttribute('src', (url as string));
}

function attachImagesToGrid(images: string[]): void {
    photoGrid.innerHTML = ''; // Clear existing content

    images.forEach((imageUrl: string) => {
        const li: HTMLLIElement = document.createElement('li');
        const img: HTMLImageElement = document.createElement('img');
        img.setAttribute('lazy-src', imageUrl);
        li.appendChild(img);
        photoGrid.appendChild(li);
    });
    ready();
}

window.onload = async function (): Promise<void> {
    fetchImages()
        .then((images: string[]) => {
            attachImagesToGrid(images);
        })
        .catch((error: Error) => {
            alert(error.message);
        });
}

searchBtn.addEventListener('click', function (): void {
    const searchInput: HTMLInputElement | null = document.getElementById('search-input') as HTMLInputElement;
    const query: string = searchInput.value;
    if (query) {
        searchImages(query)
            .then((images: string[]) => {
                attachImagesToGrid(images);
            })
            .catch((error: Error) => {
                alert(error.message);
            });
    }
});

document.querySelectorAll('.hot-search button').forEach(function (button) {
    button.addEventListener('click', function (this: HTMLButtonElement): void { 
        if (this.textContent) {
            searchImages(this.textContent)
                .then((images: string[]) => {
                    attachImagesToGrid(images);
                })
                .catch((error: Error) => {
                    alert(error.message);
                });
        }
    });
});

let input: HTMLInputElement = document.getElementById('search-input') as HTMLInputElement;
let clearButton: HTMLButtonElement = document.querySelector('.input-container button') as HTMLButtonElement;

input.addEventListener('input', function (): void {
    if (input.value.length > 0) {
        clearButton.style.display = 'block';
    } else {
        clearButton.style.display = 'none';
    }
});

input.addEventListener('keydown', function (event: KeyboardEvent) {
    if (event.key === "Enter") {
        event.preventDefault();
        const target = event.target as HTMLInputElement;
        if (target && target.value) {
            searchImages(target.value)
                .then((images: string[]) => {
                    attachImagesToGrid(images);
                })
                .catch((error: Error) => {
                    alert(error.message);
                });
        }
    }
});

clearButton.addEventListener('click', function (event: MouseEvent): void {
    event.preventDefault();
    input.value = '';
    clearButton.style.display = 'none';
    input.focus();
});

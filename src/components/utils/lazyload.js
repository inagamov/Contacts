export default {
    inserted: el => {
        // Load all the images at once
        function loadImage() {
            el.src = el.dataset.src
        }

        function callback(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage()
                    observer.unobserve(el)
                }
            })
        }

        // Use Intersection Observer API
        function createIntersectionObserver() {
            const options = {
                root: null,
                threshold: 0
            }

            const observer = new IntersectionObserver(callback, options);

            observer.observe(el)
        }

        // Chech if the browser has Intersection Observer API
        if (!window['IntersectionObserver']) {
            loadImage();
        } else {
            createIntersectionObserver();
        }

    }
}
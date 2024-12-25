const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const prediction = document.getElementById('prediction');
const confidence = document.getElementById('confidence');
const result = document.getElementById('result');
const uploadedImage = document.getElementById('uploadedImage');
const preview = document.getElementById('preview');

// Show the uploaded image in the preview section
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result; // Display the image in the preview section
            uploadedImage.style.display = 'block'; // Show the image container
        };
        reader.readAsDataURL(file);
    } else {
        uploadedImage.style.display = 'none'; // Hide the image container if no file is selected
    }
});

// Handle form submission and make the prediction request
form.addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent default form submission behavior

    const file = fileInput.files[0];
    if (!file) return alert('Please upload an image file.'); // Alert if no file is selected

    const formData = new FormData();
    formData.append('file', file); // Append the image file to the form data

    // Display loading text while processing the image
    prediction.textContent = 'Processing...';
    confidence.textContent = '';
    result.style.display = 'block'; // Ensure result section is visible

    try {
        const response = await fetch('http://localhost:8080/predict', {
            method: 'POST',
            body: formData, // Send the image file to the backend
        });

        if (!response.ok) {
            throw new Error('Prediction failed. Please try again.');
        }

        const data = await response.json();
        // Update UI with prediction results
        prediction.textContent = `Class: ${data.class}`;
        confidence.textContent = `Confidence: ${(data.confidence * 100).toFixed(2)}%`;
    } catch (error) {
        // Handle errors (e.g., network issues, prediction failures)
        prediction.textContent = 'Error: Unable to process the image.';
        confidence.textContent = '';
    }
});

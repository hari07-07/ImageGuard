async function analyzeImage() {
    const file = document.getElementById("imageInput").files[0];
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/analyze-image", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    document.getElementById("result").innerHTML =
        `Image Result: ${data.result} <br> Confidence: ${data.confidence}%`;
}

async function analyzeVideo() {
    const file = document.getElementById("videoInput").files[0];
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/analyze-video", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    document.getElementById("result").innerHTML =
        `Video Result: ${data.result} <br> Confidence: ${data.confidence}%`;
}

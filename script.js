const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';  // ← Set your real API key if needed (for backend)

const streamSelect = document.getElementById('stream');
const marksContainer = document.getElementById('marksContainer');
const careerForm = document.getElementById('careerForm');
const resultDiv = document.getElementById('result');

streamSelect.addEventListener('change', () => {
    const stream = streamSelect.value;
    let html = '';

    if (stream === 'bio') {
        html = `
            <label for="bioMarks">Biology Marks (0 - 100):</label>
            <input type="number" id="bioMarks" name="bioMarks" min="0" max="100" required />

            <label for="physicsMarks">Physics Marks (0 - 100):</label>
            <input type="number" id="physicsMarks" name="physicsMarks" min="0" max="100" required />

            <label for="chemistryMarks">Chemistry Marks (0 - 100):</label>
            <input type="number" id="chemistryMarks" name="chemistryMarks" min="0" max="100" required />

            <label for="mathMarks">Maths Marks (0 - 100):</label>
            <input type="number" id="mathMarks" name="mathMarks" min="0" max="100" required />
        `;
    } else if (stream === 'cs') {
        html = `
            <label for="csMarks">Computer Science Marks (0 - 100):</label>
            <input type="number" id="csMarks" name="csMarks" min="0" max="100" required />

            <label for="physicsMarks">Physics Marks (0 - 100):</label>
            <input type="number" id="physicsMarks" name="physicsMarks" min="0" max="100" required />

            <label for="chemistryMarks">Chemistry Marks (0 - 100):</label>
            <input type="number" id="chemistryMarks" name="chemistryMarks" min="0" max="100" required />

            <label for="mathMarks">Maths Marks (0 - 100):</label>
            <input type="number" id="mathMarks" name="mathMarks" min="0" max="100" required />
        `;
    } else {
        html = '';
    }

    marksContainer.innerHTML = html;
});

careerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(careerForm);
    const data = Object.fromEntries(formData.entries());

    // Validate marks
    const marks = ['bioMarks', 'csMarks', 'physicsMarks', 'chemistryMarks', 'mathMarks'];
    for (let markKey of marks) {
        if (data[markKey]) {
            const markValue = parseInt(data[markKey]);
            if (markValue < 0 || markValue > 100) {
                resultDiv.classList.remove('hidden');
                resultDiv.textContent = 'Error: Marks must be between 0 and 100.';
                return;
            }

            if (markValue < 35) {
                resultDiv.classList.remove('hidden');
                resultDiv.textContent = 'Sorry, you are not eligible for career guidance.';
                return;
            }
        }
    }

    resultDiv.classList.remove('hidden');
    resultDiv.textContent = 'Fetching career guidance...';

    try {
        const response = await fetch('http://localhost:3000/generate-guidance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `Student Name: ${data.studentName}
Stream: ${data.stream}
Marks: ${JSON.stringify(data)}
Interest: ${data.interest}
Provide accurate career guidance based on these details.`
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const json = await response.json();
        resultDiv.textContent = json.output || 'Unable to fetch guidance at the moment.';
    } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
        console.error('Detailed Error:', error);
    }
});

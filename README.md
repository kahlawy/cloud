# Quiz

A responsive, web-based quiz application designed to test your knowledge of cloud computing concepts.

## Features

- **Customizable Quiz:** Choose the number of questions and set a time limit.
- **Teacher Mode:** View correct answers and explanations immediately after answering.
- **Randomization:** Option to shuffle questions for a fresh experience every time.
- **Responsive Design:** Works seamlessly on desktop and mobile devices.
- **XML-Based Data:** Questions are loaded dynamically from an external XML file, making it easy to update content.

## Getting Started

### Prerequisites

You just need a modern web browser (Chrome, Firefox, Edge, Safari) to run this application.

### Installation & Usage

1.  Clone or download this repository.
2.  Open the `index.html` file in your web browser.

**Note regarding CORS:**
This application loads questions from `questions.xml`. formatting.
If you simply open `index.html` as a file (file:// protocol), modern browsers may block the request due to CORS policies.
 To avoid this:
- Use a local development server (e.g., Live Server in VS Code, `python -m http.server`, etc.).
- Or rely on the built-in local fallback mechanism if `questions.xml` fails to load.

## Project Structure

- `index.html`: The main entry point of the application.
- `styles.css`: CSS file containing all styles and variables.
- `app.js`: Core JavaScript logic for parsing XML, managing state, and handling UI interactions.
- `questions.xml`: The database of questions (XML format).
- `questions.js`: (Optional) Helper script.

## Customizing Questions

To add or modify questions, edit the `questions.xml` file following the existing structure:

```xml
<question id="1" topic="General" difficulty="Medium">
  <text>Your question text here?</text>
  <option key="A">Option A</option>
  <option key="B" correct="true">Option B (Correct)</option>
  <option key="C">Option C</option>
  <option key="D">Option D</option>
  <explanation>Explanation of why B is correct.</explanation>
</question>
```

## Technologies Used

- HTML5
- CSS3 (Vanilla, Responsive)
- JavaScript (ES6+)


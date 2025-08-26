# 🎤 Voxa – Voice-Powered Browser Automation

Voxa is a Java-based voice assistant that uses agents and Web UI to automate web tasks. Unlike ChatGPT, which can only guide users, Voxa executes commands directly in the browser, making it ideal for automation and accessibility, especially for impaired users. Commands, session history, and preferences are stored in MongoDB for persistent, personalized interactions.

## 🚀 Features

- Automate websites via text also voice commands.
- Persistent browser sessions with history stored in MongoDB.
- Multi-browser support — no repeated logins.
- Voice feedback and task execution for impaired users.
- JavaFX / Swing GUI for easy interaction.

## 🛠️ Tech Stack

- **Backend:** Java, Gemini (command processing, automation logic)
- **Browser Automation:** Selenium / Playwright Java + Browse use
- **Database:** MongoDB (stores sessions, commands, and preferences)
- **Frontend:** JavaFX / Swing Web UI
- **Voice Processing:** Java Speech API / TTS libraries

## 🎯 OOP Concepts Applied

- **Encapsulation:** Browser automation, voice input, and MongoDB operations are handled in separate classes (BrowserManager, VoiceProcessor, DatabaseHandler).
- **Abstraction:** Interfaces define contracts for commands and browser actions, hiding internal implementation.
- **Inheritance:** Different browser types (Chrome, Firefox) extend a base Browser class for shared functionality.
- **Polymorphism:** A single method like executeCommand() can handle multiple command types dynamically.
- **Modularity:** Project divided into modules for Voice, Browser, Database, and UI, making it maintainable and scalable.

## ⚡ Example – What ChatGPT Can’t Do

**Task:** “Open Gmail, check for unread emails, copy the latest email content, and open Google Docs to paste it.”

- ChatGPT can only guide step-by-step.
- Voxa executes all steps automatically via browser agents, saving time and improving accessibility.

## ⚡ Usage

1. Clone the repo:
```bash
git clone https://github.com/yourusername/voxa.git
cd voxa
```
2. Set up MongoDB locally or on cloud.
3. Run the Java application:
```bash
java -jar Voxa.jar
```
4. Speak commands like:
- “Open Gmail and read my latest email”
- “Open LinkedIn, search 'Java developer internships', filter by 'Last 7 days'”

## 🌟 Why Voxa Stands Out

- Combines voice + agents + Web UI + MongoDB to automate real tasks.
- Improves web accessibility for impaired users.
- Demonstrates Java OOP principles, backend automation, and database integration.
- Real-world utility and faculty-friendly technical depth.

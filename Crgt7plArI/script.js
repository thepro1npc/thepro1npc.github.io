document.addEventListener("DOMContentLoaded", function () {
    const terminalBody = document.getElementById("terminal-body");
    const userInput = document.getElementById("user-input");

    const commands = {
        "whoami": "A cybersecurity enthusiast breaking things (legally).",
        "languages": "Python, Lua, HTML",
        "interests": "Cybersecurity, Hacking, CTFs, Reverse Engineering",
        "tools": "Wireshark, Nmap, Burp Suite, Metasploit",
        "social": "Discord: @burntribs24",
        "clear": "", 
    };

    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            const input = userInput.value.trim();
            userInput.value = "";

            if (input.toLowerCase() === "clear") {
                terminalBody.innerHTML = "";
                return;
            }

            const output = commands[input.toLowerCase()] || "Command not found.";
            terminalBody.innerHTML += `<p>> ${input}</p><p class="output">${output}</p>`;
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const terminalBody = document.getElementById("terminal-body");
    const typedText = document.getElementById("typed-text");

    const commands = {
        "whoami": "A cybersecurity enthusiast breaking things (legally).",
        "languages": "Python, Lua, HTML",
        "interests": "Cybersecurity, Hacking, CTFs, Reverse Engineering",
        "tools": "Wireshark, Nmap, Burp Suite, Metasploit",
        "social": "Discord: @burntribs24",
        "clear": "", 
    };

    let commandBuffer = "";
    
    function executeCommand(input) {
        const output = commands[input] || "Command not found.";
        if (input === "clear") {
            terminalBody.innerHTML = "";
        } else {
            terminalBody.innerHTML += `<p>> ${input}</p><p class="output">${output}</p>`;
        }
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    document.addEventListener("keydown", function (event) {
        if (event.key.length === 1) {
            commandBuffer += event.key;
            typedText.innerText = commandBuffer;
        } else if (event.key === "Backspace") {
            commandBuffer = commandBuffer.slice(0, -1);
            typedText.innerText = commandBuffer;
        } else if (event.key === "Enter") {
            executeCommand(commandBuffer.trim());
            commandBuffer = "";
            typedText.innerText = "";
        }
    });
});

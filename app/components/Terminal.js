import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function RealTerminal() {
  const terminalRef = useRef(null);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#18181b",
        foreground: "#d4d4d4",
      },
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    // Connect to backend
    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => term.writeln("🔗 Connected to server...\r\n");

    // When backend sends data → show in terminal
    socket.onmessage = (event) => {
      term.write(event.data);
    };

    // When user types → send to backend
    term.onData((data) => {
      socket.send(data);
    });

    return () => {
      socket.close();
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} className="w-full h-96 rounded-2xl shadow bg-black" />;
}


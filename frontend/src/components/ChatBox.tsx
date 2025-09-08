"use client";

import { useState } from "react";

interface DialogOption {
  text: string;
  next: string;
}

interface DialogStep {
  question?: string;
  options?: DialogOption[];
  answer?: string;
  next?: string;
}

interface Dialog {
  [key: string]: DialogStep;
}

const dialog: Dialog = {
  start: {
    question: "Bonjour, comment puis-je vous aider ?",
    options: [
      { text: "Nos Horaires", next: "horaires" },
      { text: "Nos Tarifs", next: "tarifs" },
      { text: "Nous Contacter", next: "contact" },
    ],
  },
  horaires: {
    answer: "Nos horaires sont de 8h à 18h du lundi au vendredi.",
    next: "start",
  },
  tarifs: {
    answer: "Nos tarifs sont de 100€ à 1000€.",
    next: "start",
  },
  contact: {
    answer:
      "Nous sommes à votre disposition pour toute question. Vous pouvez nous contacter par téléphone ou email.",
    next: "start",
  },
};

export default function ChatBox() {
  const [step, setStep] = useState<string>("start");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const current = dialog[step];

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      setIsOpen(true);
      setIsClosing(false);
    }
  };

  const closeChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <>
      {!isOpen && (
        <button
          className="chat-icon"
          onClick={toggleChat}
          aria-label="Ouvrir le chat"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className={`chatbox ${isClosing ? "chatbox--closing" : ""}`}>
          <div className="chatbox__header">
            <h3>Support</h3>
            <button
              className="chatbox__close-btn"
              onClick={closeChat}
              aria-label="Fermer le chat"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {current.question && (
            <div className="chatbox__question">
              <p>{current.question}</p>
            </div>
          )}

          {current.options && (
            <div className="chatbox__options">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  className="chatbox__option-btn"
                  onClick={() => setStep(opt.next)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          )}

          {current.answer && (
            <div className="chatbox__answer">
              <p>{current.answer}</p>
              <button
                className="chatbox__back-btn"
                onClick={() => setStep(current.next || "start")}
              >
                Retour
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

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

  const current = dialog[step];

  return (
    <div className="chatbox">
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
  );
}

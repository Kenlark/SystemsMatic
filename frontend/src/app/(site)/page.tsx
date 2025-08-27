"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function Home() {
  return <div className="home-page">{/* Contenu à remplir plus tard */}</div>;
}

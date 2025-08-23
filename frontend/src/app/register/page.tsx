"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";

interface RegisterForm {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function RegisterPage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const registerForm = useForm<RegisterForm>();

  const onRegisterSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setMessage("");

    try {
      await axios.post("/api/users", data);
      setMessage("Inscription réussie! Vous pouvez maintenant vous connecter.");
      registerForm.reset();
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Erreur lors de l'inscription"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__header">
          <h2 className="auth-page__title">Inscription</h2>
          <p className="auth-page__subtitle">
            Créez votre compte System's Matic
          </p>
        </div>

        <div className="auth-card">
          {message && (
            <div
              className={`auth-card__alert ${
                message.includes("réussie")
                  ? "auth-card__alert--success"
                  : "auth-card__alert--error"
              }`}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            className="auth-form"
          >
            <div className="auth-form__row">
              <div className="auth-form__group">
                <label htmlFor="firstName" className="auth-form__label">
                  Prénom
                </label>
                <input
                  {...registerForm.register("firstName", {
                    required: "Prénom requis",
                  })}
                  type="text"
                  className="auth-form__input"
                  placeholder="John"
                />
                {registerForm.formState.errors.firstName && (
                  <p className="auth-form__error">
                    {registerForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="auth-form__group">
                <label htmlFor="lastName" className="auth-form__label">
                  Nom
                </label>
                <input
                  {...registerForm.register("lastName", {
                    required: "Nom requis",
                  })}
                  type="text"
                  className="auth-form__input"
                  placeholder="Doe"
                />
                {registerForm.formState.errors.lastName && (
                  <p className="auth-form__error">
                    {registerForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="auth-form__group">
              <label htmlFor="username" className="auth-form__label">
                Nom d'utilisateur
              </label>
              <input
                {...registerForm.register("username", {
                  required: "Nom d'utilisateur requis",
                })}
                type="text"
                className="auth-form__input"
                placeholder="john_doe"
              />
              {registerForm.formState.errors.username && (
                <p className="auth-form__error">
                  {registerForm.formState.errors.username.message}
                </p>
              )}
            </div>

            <div className="auth-form__group">
              <label htmlFor="email" className="auth-form__label">
                Email
              </label>
              <input
                {...registerForm.register("email", {
                  required: "Email requis",
                })}
                type="email"
                className="auth-form__input"
                placeholder="votre@email.com"
              />
              {registerForm.formState.errors.email && (
                <p className="auth-form__error">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="auth-form__group">
              <label htmlFor="password" className="auth-form__label">
                Mot de passe
              </label>
              <input
                {...registerForm.register("password", {
                  required: "Mot de passe requis",
                })}
                type="password"
                className="auth-form__input"
                placeholder="••••••••"
              />
              {registerForm.formState.errors.password && (
                <p className="auth-form__error">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-form__button auth-form__button--primary"
            >
              {isLoading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>

          <div className="auth-card__footer">
            <p className="auth-card__text">
              Déjà un compte?{" "}
              <Link href="/login" className="auth-card__link">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

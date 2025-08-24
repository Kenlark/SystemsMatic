"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, checkAuth } from "lib/api";

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // Vérifier uniquement l'authentification côté serveur
        const authUser = await checkAuth();
        setUser(authUser);
      } catch (error) {
        console.error(
          "Erreur lors de la vérification d'authentification:",
          error
        );
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setUser(null);
      router.push("/");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__brand">
          <Link href="/" className="navbar__logo">
            System's Matic
          </Link>
        </div>

        {/* Menu mobile */}
        <button
          className="navbar__mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="navbar__mobile-toggle-icon"></span>
          <span className="navbar__mobile-toggle-icon"></span>
          <span className="navbar__mobile-toggle-icon"></span>
        </button>

        {/* Navigation principale */}
        <div
          className={`navbar__menu ${isMenuOpen ? "navbar__menu--open" : ""}`}
        >
          <ul className="navbar__nav-list">
            <li className="navbar__nav-item">
              <Link href="/" className="navbar__nav-link">
                Accueil
              </Link>
            </li>
            <li className="navbar__nav-item">
              <Link href="/services" className="navbar__nav-link">
                Services
              </Link>
            </li>
            <li className="navbar__nav-item">
              <Link href="/about" className="navbar__nav-link">
                À propos
              </Link>
            </li>
            <li className="navbar__nav-item">
              <Link href="/contact" className="navbar__nav-link">
                Contact
              </Link>
            </li>
          </ul>

          {/* Boutons d'authentification */}
          <div className="navbar__auth">
            {!isLoading && (
              <>
                {user ? (
                  <div className="navbar__user-menu">
                    <span className="navbar__user-name">
                      Bonjour, {user.firstName || user.username}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="navbar__auth-link navbar__auth-link--logout"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="navbar__auth-link navbar__auth-link--login"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      className="navbar__auth-link navbar__auth-link--register"
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

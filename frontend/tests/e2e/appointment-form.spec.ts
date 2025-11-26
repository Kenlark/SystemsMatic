import { test, expect, Page, Route } from "@playwright/test";

test.describe("Formulaire de rendez-vous — Page d'accueil", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Interception de la requête POST vers l'API
    await page.route("**/*appointments*", async (route: Route) => {
      console.log("Intercepted request:", route.request().url());

      const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      };

      // Certains navigateurs déclenchent d'abord une requête OPTIONS (preflight).
      if (route.request().method() === "OPTIONS") {
        await route.fulfill({
          status: 204,
          headers: corsHeaders,
        });
        return;
      }

      await route.fulfill({
        status: 201,
        headers: corsHeaders,
        contentType: "application/json",
        body: JSON.stringify({
          id: "fake-appointment-id",
          message: "Rendez-vous créé avec succès",
        }),
      });
    });

    await page.goto("/");
  });

  test("soumet un formulaire valide et affiche le message de succès", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Renseigner les champs obligatoires
    await page.fill("input#firstName", "Jean");
    await page.fill("input#lastName", "Dupont");
    await page.fill("input#email", "jean.dupont@example.com");
    await page.fill("input#phone", "0690123456");

    // Sélection d'un motif (exemple : Installation)
    await page.selectOption('select[name="reason"]', { label: "Installation" });

    // Récupérer la date minimale permise par le composant (garanti valide)
    const dateInput = page.locator("input#date-picker");
    const minDate = await dateInput.getAttribute("min");
    const maxDate = await dateInput.getAttribute("max");
    if (!minDate) {
      throw new Error("Impossible de déterminer la date minimale autorisée");
    }
    const targetDate = await page.evaluate(
      ({ min, max }) => {
        const toIsoDate = (date: Date) => {
          const year = date.getFullYear();
          const month = `${date.getMonth() + 1}`.padStart(2, "0");
          const day = `${date.getDate()}`.padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const base = new Date(`${min}T12:00:00`);
        base.setDate(base.getDate() + 1); // garantit > 24h après le min

        if (max) {
          const maxDate = new Date(`${max}T12:00:00`);
          if (base > maxDate) {
            return max;
          }
        }

        return toIsoDate(base);
      },
      { min: minDate, max: maxDate }
    );
    await dateInput.fill(targetDate);

    // Sélectionner le premier créneau disponible plutôt qu'une valeur codée
    const timeSelect = page.locator("select#time-picker");
    const firstSlot = await timeSelect
      .locator('option:not([value=""])')
      .first()
      .getAttribute("value");
    if (!firstSlot) {
      throw new Error("Aucun créneau horaire disponible dans le sélecteur");
    }
    await page.selectOption("select#time-picker", firstSlot);

    // Attendre que le champ caché `requestedAt` (piloté par RHF) soit renseigné
    await expect(
      page.locator('input[type="hidden"][name="requestedAt"]')
    ).not.toHaveValue("");

    // Attendre un petit instant que la valeur soit propagée à React Hook Form
    await page.waitForTimeout(300);

    // Consentement RGPD si présent
    const consentCheckbox = page.locator(
      'input[type="checkbox"][name="consent"]'
    );
    if (await consentCheckbox.count()) {
      await consentCheckbox.check();
    }

    // Attendre un peu pour s'assurer que tous les champs sont remplis
    await page.waitForTimeout(500);

    // Soumission
    await page.click('#appointment-form button[type="submit"]');

    // Attendre que le message de succès apparaisse (remplace le formulaire)
    await page.waitForSelector(".success-container", { timeout: 10000 });

    // Vérification du succès
    await expect(page.locator("h2.success-title")).toBeVisible();
    await expect(page.locator("h2.success-title")).toContainText(
      "Demande envoyée avec succès !"
    );
    await expect(
      page.getByText("Vous recevrez bientôt un email de confirmation")
    ).toBeVisible();
  });

  test("affiche les erreurs de validation si le formulaire est incomplet", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Cliquer sur le bouton de soumission sans remplir le formulaire
    await page.click('#appointment-form button[type="submit"]');

    // Attendre que le toast d'erreur apparaisse
    await page.waitForSelector(".Toastify__toast--error", { timeout: 5000 });

    // Vérifier que le toast d'erreur contient le bon message
    await expect(page.locator(".Toastify__toast--error")).toContainText(
      "Veuillez corriger les erreurs dans le formulaire"
    );

    // Attendre que les messages d'erreur sous les champs apparaissent
    await page.waitForSelector("p.form-error", { timeout: 5000 });

    // Vérifier que les messages d'erreur sont présents
    const errorMessages = page.locator("p.form-error");
    await expect(errorMessages).toHaveCount(5); // Prénom, nom, email, date/heure, consent manquants

    // Vérifier le contenu des messages d'erreur
    await expect(errorMessages).toContainText([
      "Le prénom est requis",
      "Le nom est requis",
      "L'email est requis",
      "La date et l'heure sont requises",
      "Vous devez accepter les conditions",
    ]);
  });

  test("affiche les erreurs de validation si le formulaire est partiellement rempli", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Remplir seulement le prénom
    await page.fill("input#firstName", "Jean");

    // Cliquer sur le bouton de soumission
    await page.click('#appointment-form button[type="submit"]');

    // Attendre que le toast d'erreur apparaisse
    await page.waitForSelector(".Toastify__toast--error", { timeout: 5000 });

    // Vérifier que le toast d'erreur contient le bon message
    await expect(page.locator(".Toastify__toast--error")).toContainText(
      "Veuillez corriger les erreurs dans le formulaire"
    );

    // Attendre que les messages d'erreur sous les champs apparaissent
    await page.waitForSelector("p.form-error", { timeout: 5000 });

    // Vérifier que les messages d'erreur sont présents
    const errorMessages = page.locator("p.form-error");
    await expect(errorMessages).toHaveCount(4); // Nom, email, date/heure, consent manquants

    // Vérifier le contenu des messages d'erreur
    await expect(errorMessages).toContainText([
      "Le nom est requis",
      "L'email est requis",
      "La date et l'heure sont requises",
      "Vous devez accepter les conditions",
    ]);
  });
});

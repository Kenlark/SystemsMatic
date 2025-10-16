import { renderHook, act } from "@testing-library/react";
import { useQuotes } from "../useQuotes";
import { backofficeApi } from "@/lib/backoffice-api";
import { showSuccess, showError } from "@/lib/toast";

// Mock des dépendances
jest.mock("@/lib/backoffice-api");
jest.mock("@/lib/toast");

const mockedBackofficeApi = backofficeApi as jest.Mocked<typeof backofficeApi>;
const mockedShowSuccess = showSuccess as jest.MockedFunction<
  typeof showSuccess
>;
const mockedShowError = showError as jest.MockedFunction<typeof showError>;

describe("useQuotes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("État initial", () => {
    it("devrait avoir un état initial correct", () => {
      const { result } = renderHook(() => useQuotes());

      expect(result.current.quotes).toEqual([]);
      expect(result.current.quotesLoading).toBe(true);
      expect(result.current.quotesStats).toBe(null);
      expect(result.current.quotesFilter).toBe("");
    });
  });

  describe("fetchQuotes", () => {
    it("devrait charger les devis avec succès", async () => {
      const mockQuotes = [
        {
          id: "1",
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean@example.com",
          message: "Demande de devis",
          status: "PENDING",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockResponse = { data: mockQuotes, total: 1, page: 1, limit: 50 };
      mockedBackofficeApi.getQuotes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useQuotes());

      await act(async () => {
        await result.current.fetchQuotes();
      });

      expect(mockedBackofficeApi.getQuotes).toHaveBeenCalledWith({
        status: undefined,
        page: 1,
        limit: 50,
      });
      expect(result.current.quotes).toEqual(mockQuotes);
      expect(result.current.quotesLoading).toBe(false);
    });

    it("devrait charger les devis avec un filtre", async () => {
      const mockQuotes: any[] = [];
      const mockResponse = { data: mockQuotes, total: 0, page: 1, limit: 50 };
      mockedBackofficeApi.getQuotes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useQuotes());

      // Définir un filtre
      act(() => {
        result.current.setQuotesFilter("PENDING");
      });

      await act(async () => {
        await result.current.fetchQuotes();
      });

      expect(mockedBackofficeApi.getQuotes).toHaveBeenCalledWith({
        status: "PENDING",
        page: 1,
        limit: 50,
      });
    });

    it("devrait gérer les erreurs lors du chargement", async () => {
      const mockError = new Error("Erreur réseau");
      mockedBackofficeApi.getQuotes.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() => useQuotes());

      await act(async () => {
        await result.current.fetchQuotes();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors du chargement des devis:",
        mockError
      );
      expect(mockedShowError).toHaveBeenCalledWith(
        "Erreur lors du chargement des devis"
      );
      expect(result.current.quotesLoading).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe("fetchQuotesStats", () => {
    it("devrait charger les statistiques avec succès", async () => {
      const mockStats = {
        total: 10,
        pending: 5,
        accepted: 3,
        rejected: 2,
      };

      mockedBackofficeApi.getQuotesStats.mockResolvedValue(mockStats);

      const { result } = renderHook(() => useQuotes());

      await act(async () => {
        await result.current.fetchQuotesStats();
      });

      expect(mockedBackofficeApi.getQuotesStats).toHaveBeenCalled();
      expect(result.current.quotesStats).toEqual(mockStats);
    });

    it("devrait gérer les erreurs lors du chargement des statistiques", async () => {
      const mockError = new Error("Erreur statistiques");
      mockedBackofficeApi.getQuotesStats.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() => useQuotes());

      await act(async () => {
        await result.current.fetchQuotesStats();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors du chargement des statistiques des devis:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("updateQuoteStatus", () => {
    it("devrait mettre à jour le statut d'un devis avec succès", async () => {
      mockedBackofficeApi.updateQuoteStatus.mockResolvedValue(undefined);
      mockedBackofficeApi.getQuotes.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 50,
      });
      mockedBackofficeApi.getQuotesStats.mockResolvedValue({});

      const { result } = renderHook(() => useQuotes());

      await act(async () => {
        await result.current.updateQuoteStatus("quote-1", "ACCEPTED");
      });

      expect(mockedBackofficeApi.updateQuoteStatus).toHaveBeenCalledWith(
        "quote-1",
        "ACCEPTED"
      );
      expect(mockedBackofficeApi.getQuotes).toHaveBeenCalled();
      expect(mockedBackofficeApi.getQuotesStats).toHaveBeenCalled();
    });

    it("devrait gérer les erreurs lors de la mise à jour", async () => {
      const mockError = new Error("Erreur mise à jour");
      mockedBackofficeApi.updateQuoteStatus.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() => useQuotes());

      await act(async () => {
        await result.current.updateQuoteStatus("quote-1", "ACCEPTED");
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors de la mise à jour du statut:",
        mockError
      );
      expect(mockedShowError).toHaveBeenCalledWith(
        "Erreur lors de la mise à jour du statut"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("setQuotesFilter", () => {
    it("devrait changer le filtre des devis", () => {
      const { result } = renderHook(() => useQuotes());

      act(() => {
        result.current.setQuotesFilter("PENDING");
      });

      expect(result.current.quotesFilter).toBe("PENDING");
    });
  });
});

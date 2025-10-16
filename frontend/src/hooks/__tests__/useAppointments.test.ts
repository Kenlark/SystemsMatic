import { renderHook, act } from "@testing-library/react";
import { useAppointments } from "../useAppointments";
import { backofficeApi } from "@/lib/backoffice-api";
import { showSuccess, showError } from "@/lib/toast";
import { AppointmentStatus } from "@/types/appointment";

// Mock des dépendances
jest.mock("@/lib/backoffice-api");
jest.mock("@/lib/toast");

const mockedBackofficeApi = backofficeApi as jest.Mocked<typeof backofficeApi>;
const mockedShowSuccess = showSuccess as jest.MockedFunction<
  typeof showSuccess
>;
const mockedShowError = showError as jest.MockedFunction<typeof showError>;

describe("useAppointments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("État initial", () => {
    it("devrait avoir un état initial correct", () => {
      const { result } = renderHook(() => useAppointments());

      expect(result.current.appointments).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.filter).toBe("ALL");
      expect(result.current.stats).toBe(null);
    });
  });

  describe("fetchAppointments", () => {
    it("devrait charger les rendez-vous avec succès", async () => {
      const mockAppointments = [
        {
          id: "1",
          contactId: "contact-1",
          status: "PENDING" as AppointmentStatus,
          requestedAt: new Date(),
          timezone: "Europe/Paris",
          confirmationToken: "token-1",
          cancellationToken: "token-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          contact: {
            id: "contact-1",
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean@example.com",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];

      mockedBackofficeApi.getAppointments.mockResolvedValue(mockAppointments);

      const { result } = renderHook(() => useAppointments());

      await act(async () => {
        await result.current.fetchAppointments();
      });

      expect(mockedBackofficeApi.getAppointments).toHaveBeenCalledWith("ALL");
      expect(result.current.appointments).toEqual(mockAppointments);
      expect(result.current.loading).toBe(false);
    });

    it("devrait gérer les erreurs lors du chargement", async () => {
      const mockError = new Error("Erreur réseau");
      mockedBackofficeApi.getAppointments.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() => useAppointments());

      await act(async () => {
        await result.current.fetchAppointments();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors du chargement des rendez-vous:",
        mockError
      );
      expect(mockedShowError).toHaveBeenCalledWith(
        "Erreur lors du chargement des rendez-vous"
      );
      expect(result.current.loading).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe("fetchStats", () => {
    it("devrait charger les statistiques avec succès", async () => {
      const mockStats = {
        total: 10,
        pending: 5,
        confirmed: 3,
        cancelled: 2,
      };

      mockedBackofficeApi.getStats.mockResolvedValue(mockStats);

      const { result } = renderHook(() => useAppointments());

      await act(async () => {
        await result.current.fetchStats();
      });

      expect(mockedBackofficeApi.getStats).toHaveBeenCalled();
      expect(result.current.stats).toEqual(mockStats);
    });

    it("devrait gérer les erreurs lors du chargement des statistiques", async () => {
      const mockError = new Error("Erreur statistiques");
      mockedBackofficeApi.getStats.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() => useAppointments());

      await act(async () => {
        await result.current.fetchStats();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors du chargement des statistiques:",
        mockError
      );
      expect(mockedShowError).toHaveBeenCalledWith(
        "Erreur lors du chargement des statistiques"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("updateAppointmentStatus", () => {
    it("devrait mettre à jour le statut d'un rendez-vous avec succès", async () => {
      mockedBackofficeApi.updateAppointmentStatus.mockResolvedValue(undefined);
      mockedBackofficeApi.getAppointments.mockResolvedValue([]);
      mockedBackofficeApi.getStats.mockResolvedValue({});

      const { result } = renderHook(() => useAppointments());

      await act(async () => {
        await result.current.updateAppointmentStatus(
          "appointment-1",
          AppointmentStatus.CONFIRMED
        );
      });

      expect(mockedBackofficeApi.updateAppointmentStatus).toHaveBeenCalledWith(
        "appointment-1",
        { status: AppointmentStatus.CONFIRMED, scheduledAt: undefined }
      );
      expect(mockedBackofficeApi.getAppointments).toHaveBeenCalled();
      expect(mockedBackofficeApi.getStats).toHaveBeenCalled();
    });

    it("devrait mettre à jour le statut avec une date programmée", async () => {
      mockedBackofficeApi.updateAppointmentStatus.mockResolvedValue(undefined);
      mockedBackofficeApi.getAppointments.mockResolvedValue([]);
      mockedBackofficeApi.getStats.mockResolvedValue({});

      const { result } = renderHook(() => useAppointments());

      await act(async () => {
        await result.current.updateAppointmentStatus(
          "appointment-1",
          AppointmentStatus.CONFIRMED,
          "2024-01-15T10:00:00Z"
        );
      });

      expect(mockedBackofficeApi.updateAppointmentStatus).toHaveBeenCalledWith(
        "appointment-1",
        {
          status: AppointmentStatus.CONFIRMED,
          scheduledAt: "2024-01-15T10:00:00Z",
        }
      );
    });

    it("devrait gérer les erreurs lors de la mise à jour", async () => {
      const mockError = new Error("Erreur mise à jour");
      mockedBackofficeApi.updateAppointmentStatus.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() => useAppointments());

      await act(async () => {
        await result.current.updateAppointmentStatus(
          "appointment-1",
          AppointmentStatus.CONFIRMED
        );
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors de la mise à jour:",
        mockError
      );
      expect(mockedShowError).toHaveBeenCalledWith(
        "Erreur lors de la mise à jour du statut"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("setFilter", () => {
    it("devrait changer le filtre", () => {
      const { result } = renderHook(() => useAppointments());

      act(() => {
        result.current.setFilter(AppointmentStatus.PENDING);
      });

      expect(result.current.filter).toBe("PENDING");
    });
  });
});

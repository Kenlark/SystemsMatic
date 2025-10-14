import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { BackofficeModule } from '../../src/backoffice/backoffice.module';
import { AuthModule } from '../../src/auth/auth.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('TI04 - Backoffice + AuthModule - Protection des routes admin', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const testAdmin = {
    email: 'admin@test.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'Test',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BackofficeModule, AuthModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        adminUser: {
          findUnique: jest.fn(),
          update: jest.fn(),
        },
        appointment: {
          findMany: jest.fn().mockResolvedValue([]),
        },
        quote: {
          findMany: jest.fn().mockResolvedValue([]),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /backoffice/appointments', () => {
    it('devrait retourner la liste des rendez-vous pour un admin authentifié', async () => {
      // Arrange - Connexion admin
      const hashedPassword = await bcrypt.hash(testAdmin.password, 10);
      const adminWithHash = {
        ...testAdmin,
        password: hashedPassword,
        id: 'admin-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.adminUser.findUnique as jest.Mock).mockResolvedValue(
        adminWithHash,
      );
      (prisma.adminUser.update as jest.Mock).mockResolvedValue(adminWithHash);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testAdmin.email,
          password: testAdmin.password,
        });

      const cookies = loginResponse.headers['set-cookie'];

      // Act
      const response = await request(app.getHttpServer())
        .get('/backoffice/appointments')
        .set('Cookie', Array.isArray(cookies) ? cookies.join('; ') : cookies);

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("devrait rejeter l'accès sans authentification", async () => {
      // Act
      const response = await request(app.getHttpServer()).get(
        '/backoffice/appointments',
      );

      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe('GET /backoffice/quotes', () => {
    it('devrait retourner la liste des devis pour un admin authentifié', async () => {
      // Arrange - Connexion admin
      const hashedPassword = await bcrypt.hash(testAdmin.password, 10);
      const adminWithHash = {
        ...testAdmin,
        password: hashedPassword,
        id: 'admin-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.adminUser.findUnique as jest.Mock).mockResolvedValue(
        adminWithHash,
      );
      (prisma.adminUser.update as jest.Mock).mockResolvedValue(adminWithHash);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testAdmin.email,
          password: testAdmin.password,
        });

      const cookies = loginResponse.headers['set-cookie'];

      // Act
      const response = await request(app.getHttpServer())
        .get('/backoffice/quotes')
        .set('Cookie', Array.isArray(cookies) ? cookies.join('; ') : cookies);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it("devrait rejeter l'accès sans authentification", async () => {
      // Act
      const response = await request(app.getHttpServer()).get(
        '/backoffice/quotes',
      );

      // Assert
      expect(response.status).toBe(401);
    });
  });
});

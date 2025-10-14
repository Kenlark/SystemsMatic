import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { QuotesModule } from '../../src/quotes/quotes.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { MailService } from '../../src/mail/mail.service';

describe('TI03 - QuotesController + MailModule Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mailService: MailService;

  const mockContact = {
    id: 'contact-123',
    email: 'client@test.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '+590690123456',
    consent: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockQuote = {
    id: 'quote-123',
    contactId: 'contact-123',
    projectType: 'Portail automatique',
    description: 'Installation complète',
    estimatedPrice: 2500,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
    contact: mockContact,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [QuotesModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        contact: {
          upsert: jest.fn().mockResolvedValue(mockContact),
          findUnique: jest.fn().mockResolvedValue(mockContact),
        },
        quote: {
          create: jest.fn().mockResolvedValue(mockQuote),
          findMany: jest.fn().mockResolvedValue([mockQuote]),
        },
      })
      .overrideProvider(MailService)
      .useValue({
        sendQuoteConfirmation: jest.fn().mockResolvedValue(undefined),
        sendQuoteNotificationEmail: jest.fn().mockResolvedValue(undefined),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    mailService = moduleFixture.get<MailService>(MailService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /quotes', () => {
    it('devrait créer un devis et envoyer automatiquement les emails', async () => {
      // Arrange
      const quoteData = {
        email: 'client@test.com',
        firstName: 'Jean',
        lastName: 'Dupont',
        phone: '+590690123456',
        projectType: 'Portail automatique',
        description: 'Installation complète',
        estimatedPrice: 2500,
        consent: true,
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/quotes')
        .send(quoteData)
        .expect(201);

      // Assert
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('contactId');
      expect(prisma.contact.upsert).toHaveBeenCalled();
      expect(prisma.quote.create).toHaveBeenCalled();
    });

    it('devrait valider les données du devis avant création', async () => {
      // Arrange
      const invalidQuoteData = {
        email: 'invalid-email',
        firstName: '',
        projectType: '',
        estimatedPrice: -100,
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/quotes')
        .send(invalidQuoteData);

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe('GET /quotes', () => {
    it('devrait récupérer la liste des devis', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get('/quotes')
        .expect(200);

      // Assert
      expect(Array.isArray(response.body)).toBe(true);
      expect(prisma.quote.findMany).toHaveBeenCalled();
    });
  });
});

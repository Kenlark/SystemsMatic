/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/

CREATE EXTENSION IF NOT EXISTS citext;

-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."AppointmentReason" AS ENUM ('DIAGNOSTIC', 'INSTALLATION', 'MAINTENANCE', 'AUTRE');

-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "phone" TEXT,
    "consentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Appointment" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "reason" "public"."AppointmentReason",
    "reasonOther" TEXT,
    "message" TEXT,
    "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3),
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "location" TEXT,
    "confirmationToken" TEXT NOT NULL,
    "cancellationToken" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "reminderJobId" TEXT,
    "reminderScheduledAt" TIMESTAMP(3),
    "reminderSentAt" TIMESTAMP(3),
    "lastEmailAt" TIMESTAMP(3),
    "createdIp" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmailLog" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contact_lastName_firstName_idx" ON "public"."Contact"("lastName", "firstName");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "public"."Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_confirmationToken_key" ON "public"."Appointment"("confirmationToken");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_cancellationToken_key" ON "public"."Appointment"("cancellationToken");

-- CreateIndex
CREATE INDEX "Appointment_contactId_idx" ON "public"."Appointment"("contactId");

-- CreateIndex
CREATE INDEX "Appointment_status_scheduledAt_idx" ON "public"."Appointment"("status", "scheduledAt");

-- CreateIndex
CREATE INDEX "Appointment_scheduledAt_idx" ON "public"."Appointment"("scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_contactId_scheduledAt_key" ON "public"."Appointment"("contactId", "scheduledAt");

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmailLog" ADD CONSTRAINT "EmailLog_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

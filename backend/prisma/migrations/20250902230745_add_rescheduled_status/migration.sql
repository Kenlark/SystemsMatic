-- AlterEnum
ALTER TYPE "public"."AppointmentStatus" ADD VALUE 'RESCHEDULED';

-- AlterTable
ALTER TABLE "public"."AdminUser" ALTER COLUMN "id" DROP DEFAULT;

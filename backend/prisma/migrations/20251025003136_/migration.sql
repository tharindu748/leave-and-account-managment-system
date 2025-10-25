-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "join_date" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "salary_config" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "basicSalary" DOUBLE PRECISION NOT NULL,
    "otRate" DOUBLE PRECISION DEFAULT 0,
    "allowance" DOUBLE PRECISION DEFAULT 0,
    "deduction" DOUBLE PRECISION DEFAULT 0,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_records" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "basicSalary" DOUBLE PRECISION NOT NULL,
    "totalLeave" INTEGER NOT NULL DEFAULT 0,
    "leaveDeductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overtimePay" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netSalary" DOUBLE PRECISION NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "salary_records_userId_month_year_key" ON "salary_records"("userId", "month", "year");

-- AddForeignKey
ALTER TABLE "salary_config" ADD CONSTRAINT "salary_config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_records" ADD CONSTRAINT "salary_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

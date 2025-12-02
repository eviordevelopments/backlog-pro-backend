import { MigrationInterface, QueryRunner } from "typeorm";

export class InitalSchema1764654436839 implements MigrationInterface {
    name = 'InitalSchema1764654436839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "avatar" character varying(500), "skills" jsonb, "hourlyRate" numeric(10,2), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8481388d6325e752cd4d7e26c6" ON "user_profiles" ("userId") `);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "clientId" uuid NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'planning', "methodology" character varying(50), "budget" numeric(15,2) NOT NULL DEFAULT '0', "spent" numeric(15,2) NOT NULL DEFAULT '0', "startDate" date, "endDate" date, "progress" integer NOT NULL DEFAULT '0', "devopsStage" character varying(50), "priority" character varying(50), "tags" jsonb, "repositoryUrl" character varying(500), "deploymentUrl" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a27865a7be17886e3088f4a650" ON "projects" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_091f9433895a53408cb8ae3864" ON "projects" ("clientId") `);
        await queryRunner.query(`CREATE TABLE "sprints" ("id" uuid NOT NULL, "name" character varying(255) NOT NULL, "projectId" uuid NOT NULL, "goal" text, "startDate" date NOT NULL, "endDate" date NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'planning', "velocity" integer NOT NULL DEFAULT '0', "storyPointsCommitted" integer NOT NULL DEFAULT '0', "storyPointsCompleted" integer NOT NULL DEFAULT '0', "teamMembers" jsonb NOT NULL DEFAULT '[]', "sprintPlanningDate" TIMESTAMP, "sprintReviewDate" TIMESTAMP, "sprintRetrospectiveDate" TIMESTAMP, "dailyStandupTime" character varying(5) NOT NULL DEFAULT '09:00', "retrospectiveNotes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_6800aa2e0f508561812c4b9afb4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" text, "projectId" uuid NOT NULL, "sprintId" uuid, "status" character varying(50) NOT NULL DEFAULT 'todo', "priority" character varying(50) NOT NULL DEFAULT 'medium', "assignedTo" uuid, "estimatedHours" numeric(10,2) NOT NULL DEFAULT '0', "actualHours" numeric(10,2) NOT NULL DEFAULT '0', "storyPoints" integer NOT NULL DEFAULT '0', "dueDate" date, "tags" jsonb NOT NULL DEFAULT '[]', "dependencies" jsonb NOT NULL DEFAULT '[]', "subtasks" jsonb NOT NULL DEFAULT '[]', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "time_entries" ("id" uuid NOT NULL, "taskId" uuid NOT NULL, "userId" uuid NOT NULL, "hours" numeric(10,2) NOT NULL, "date" date NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_b8bc5f10269ba2fe88708904aa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_stories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid NOT NULL, "sprintId" uuid, "title" character varying(255) NOT NULL, "userType" character varying(100) NOT NULL, "action" text NOT NULL, "benefit" text NOT NULL, "acceptanceCriteria" jsonb, "storyPoints" integer NOT NULL DEFAULT '0', "priority" character varying(50) NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'backlog', "assignedTo" uuid, "definitionOfDone" text, "impactMetrics" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2eb2857c3f0754ea3260194524b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_02b04bef0363881e9429d6f7ae" ON "user_stories" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_69eed10b1bcfa40615c6e28eab" ON "user_stories" ("sprintId") `);
        await queryRunner.query(`CREATE INDEX "IDX_14b7df6039f6289956d410e541" ON "user_stories" ("projectId") `);
        await queryRunner.query(`CREATE TABLE "risks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" text, "category" character varying(100) NOT NULL, "probability" character varying(50) NOT NULL, "impact" character varying(50) NOT NULL, "mitigationStrategy" text, "responsibleId" uuid NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'identified', "isCore" boolean NOT NULL DEFAULT false, "comments" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_df437126f5dd05e856b8bf7157f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a6adaa91008acb4ed91402b038" ON "risks" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_74849b6ccb5ac008ef53558571" ON "risks" ("projectId") `);
        await queryRunner.query(`CREATE TABLE "project_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid NOT NULL, "userId" uuid NOT NULL, "role" character varying(50) NOT NULL DEFAULT 'developer', "joinedAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_0b2f46f804be4aea9234c78bcc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_08d1346ff91abba68e5a637cfd" ON "project_members" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d19892d8f03928e5bfc7313780" ON "project_members" ("projectId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_326b2a901eb18ac24eabc9b058" ON "project_members" ("projectId", "userId") `);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "type" character varying(100) NOT NULL, "title" character varying(255) NOT NULL, "message" text NOT NULL, "metadata" jsonb, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8ba28344602d583583b9ea1a50" ON "notifications" ("isRead") `);
        await queryRunner.query(`CREATE INDEX "IDX_692a909ee0fa9383e7859f9b40" ON "notifications" ("userId") `);
        await queryRunner.query(`CREATE TABLE "meetings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "type" character varying(50) NOT NULL, "projectId" uuid, "sprintId" uuid, "dateTime" TIMESTAMP NOT NULL, "duration" integer NOT NULL, "participants" jsonb, "ownerId" uuid NOT NULL, "agenda" text, "notes" text, "isRecurring" boolean NOT NULL DEFAULT false, "recurringPattern" character varying(50), "status" character varying(50) NOT NULL DEFAULT 'scheduled', "attendance" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_aa73be861afa77eb4ed31f3ed57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d18be740055cddc6b157c36ea6" ON "meetings" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_430cc83b3f98820004cf2da874" ON "meetings" ("sprintId") `);
        await queryRunner.query(`CREATE INDEX "IDX_945e04d31be6d4cc5934b4668f" ON "meetings" ("projectId") `);
        await queryRunner.query(`CREATE TABLE "goals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "type" character varying(50) NOT NULL, "category" character varying(100) NOT NULL, "period" character varying(50) NOT NULL, "targetValue" numeric(15,2) NOT NULL, "currentValue" numeric(15,2) NOT NULL DEFAULT '0', "unit" character varying(50) NOT NULL, "ownerId" uuid NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_26e17b251afab35580dff769223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e2afa3198d42a36e03b50ca1dd" ON "goals" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_aad02eec6766a51b7e9f1e782e" ON "goals" ("ownerId") `);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(50) NOT NULL, "category" character varying(100) NOT NULL, "amount" numeric(15,2) NOT NULL, "currency" character varying(10) NOT NULL DEFAULT 'USD', "date" date NOT NULL, "description" text, "clientId" uuid, "projectId" uuid, "isRecurring" boolean NOT NULL DEFAULT false, "recurringFrequency" character varying(50), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2d5fa024a84dceb158b2b95f34" ON "transactions" ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_605be897e18635c785596cbaa9" ON "transactions" ("clientId") `);
        await queryRunner.query(`CREATE INDEX "IDX_92d1d5070de965ff398a522b4f" ON "transactions" ("projectId") `);
        await queryRunner.query(`CREATE TABLE "invoices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoiceNumber" character varying(50) NOT NULL, "clientId" uuid NOT NULL, "projectId" uuid, "amount" numeric(15,2) NOT NULL, "tax" numeric(15,2) NOT NULL, "total" numeric(15,2) NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'draft', "issueDate" date NOT NULL, "dueDate" date NOT NULL, "paidDate" date, "items" jsonb, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_bf8e0f9dd4558ef209ec111782d" UNIQUE ("invoiceNumber"), CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_bf8e0f9dd4558ef209ec111782" ON "invoices" ("invoiceNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_ac0f09364e3701d9ed35435288" ON "invoices" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_20d900c6b7f2de7faa4d214d64" ON "invoices" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9df936180710f9968da7cf4a5" ON "invoices" ("clientId") `);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fromUserId" uuid NOT NULL, "toUserId" uuid NOT NULL, "type" character varying(50) NOT NULL, "category" character varying(100) NOT NULL, "rating" integer NOT NULL, "comment" text NOT NULL, "sprintId" uuid, "isAnonymous" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f5f44f663ee6bf25dcfab3987f" ON "feedback" ("sprintId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fefc350f416e262e904dcf6b35" ON "feedback" ("toUserId") `);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(20), "company" character varying(255), "industry" character varying(255), "status" character varying(50) NOT NULL DEFAULT 'active', "ltv" numeric(15,2) NOT NULL DEFAULT '0', "cac" numeric(15,2) NOT NULL DEFAULT '0', "mrr" numeric(15,2) NOT NULL DEFAULT '0', "contractStart" date, "contractEnd" date, "npsScore" integer, "csatScore" integer, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "passwordHash" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "avatar" character varying(500), "skills" jsonb, "hourlyRate" numeric(10,2), "isEmailVerified" boolean NOT NULL DEFAULT false, "passwordResetToken" character varying(255), "passwordResetExpiresAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "achievements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text NOT NULL, "icon" character varying(255) NOT NULL, "category" character varying(100) NOT NULL, "points" integer NOT NULL, "rarity" character varying(50) NOT NULL, "requirement" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_achievements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "achievementId" uuid NOT NULL, "unlockedAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3d94aba7e9ed55365f68b5e77fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sprints" ADD CONSTRAINT "FK_12a81f920cc034f4c532766bf18" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_109de917495c10ad211df0b03e7" FOREIGN KEY ("sprintId") REFERENCES "sprints"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_entries" ADD CONSTRAINT "FK_8cfb57662e88d7c65010311661d" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_entries" DROP CONSTRAINT "FK_8cfb57662e88d7c65010311661d"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_109de917495c10ad211df0b03e7"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`);
        await queryRunner.query(`ALTER TABLE "sprints" DROP CONSTRAINT "FK_12a81f920cc034f4c532766bf18"`);
        await queryRunner.query(`DROP TABLE "user_achievements"`);
        await queryRunner.query(`DROP TABLE "achievements"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fefc350f416e262e904dcf6b35"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5f44f663ee6bf25dcfab3987f"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9df936180710f9968da7cf4a5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20d900c6b7f2de7faa4d214d64"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac0f09364e3701d9ed35435288"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bf8e0f9dd4558ef209ec111782"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_92d1d5070de965ff398a522b4f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_605be897e18635c785596cbaa9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2d5fa024a84dceb158b2b95f34"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aad02eec6766a51b7e9f1e782e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2afa3198d42a36e03b50ca1dd"`);
        await queryRunner.query(`DROP TABLE "goals"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_945e04d31be6d4cc5934b4668f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_430cc83b3f98820004cf2da874"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d18be740055cddc6b157c36ea6"`);
        await queryRunner.query(`DROP TABLE "meetings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_692a909ee0fa9383e7859f9b40"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ba28344602d583583b9ea1a50"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_326b2a901eb18ac24eabc9b058"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d19892d8f03928e5bfc7313780"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08d1346ff91abba68e5a637cfd"`);
        await queryRunner.query(`DROP TABLE "project_members"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74849b6ccb5ac008ef53558571"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a6adaa91008acb4ed91402b038"`);
        await queryRunner.query(`DROP TABLE "risks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_14b7df6039f6289956d410e541"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_69eed10b1bcfa40615c6e28eab"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_02b04bef0363881e9429d6f7ae"`);
        await queryRunner.query(`DROP TABLE "user_stories"`);
        await queryRunner.query(`DROP TABLE "time_entries"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "sprints"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_091f9433895a53408cb8ae3864"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a27865a7be17886e3088f4a650"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8481388d6325e752cd4d7e26c6"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
    }

}

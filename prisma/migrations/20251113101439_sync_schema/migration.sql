-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "clerk_id" TEXT,
    "email" TEXT,
    "name" TEXT,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "summary" TEXT,
    "userid" INTEGER,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "id" SERIAL NOT NULL,
    "question" TEXT,
    "options" TEXT[],
    "answer" TEXT,
    "articleid" INTEGER,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizattempt" (
    "id" SERIAL NOT NULL,
    "quizid" INTEGER,
    "userid" INTEGER,
    "score" INTEGER,
    "timespent" INTEGER,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quizattempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizanswer" (
    "id" SERIAL NOT NULL,
    "quizattemptid" INTEGER,
    "quizid" INTEGER,
    "question" TEXT,
    "selected" TEXT,
    "correct" TEXT,
    "iscorrect" BOOLEAN,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quizanswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userscore" (
    "id" SERIAL NOT NULL,
    "quizid" INTEGER,
    "userid" INTEGER,
    "score" INTEGER,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userscore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_articleid_fkey" FOREIGN KEY ("articleid") REFERENCES "article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizattempt" ADD CONSTRAINT "quizattempt_quizid_fkey" FOREIGN KEY ("quizid") REFERENCES "quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizattempt" ADD CONSTRAINT "quizattempt_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizanswer" ADD CONSTRAINT "quizanswer_quizattemptid_fkey" FOREIGN KEY ("quizattemptid") REFERENCES "quizattempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizanswer" ADD CONSTRAINT "quizanswer_quizid_fkey" FOREIGN KEY ("quizid") REFERENCES "quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userscore" ADD CONSTRAINT "userscore_quizid_fkey" FOREIGN KEY ("quizid") REFERENCES "quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userscore" ADD CONSTRAINT "userscore_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
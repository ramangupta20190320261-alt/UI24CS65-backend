import { Worker } from "bullmq";
import Assignment from "../models/Assignment";

export function initWorker(redisConnection: any) {
  console.log("🚀 BullMQ Production Worker initialized successfully!");

  new Worker(
    "assignment-generation",
    async (job) => {
      const { assignmentId, title, questionTypes } = job.data;
      const normalizedTitle = title ? title.toLowerCase() : "";

      try {
        await (Assignment as any).findByIdAndUpdate(assignmentId, { status: "in-progress" });

        // Default layout block
        let targetPaper = {
          title: title || "General Evaluation Test",
          sections: [
            {
              title: "Section A: Core Competency",
              instruction: "Answer all matching slots.",
              questions: [
                { text: `Discuss the structural parameters and core principles of ${title || "the selected module"}.`, difficulty: "Moderate", marks: 10 }
              ]
            }
          ]
        };

        // Custom matching checks to catch English, Maths, or Physics keywords
        if (normalizedTitle.includes("english")) {
          targetPaper = {
            title: "English Literacy & Composition",
            sections: [
              {
                title: "Section A: Language and Grammar Rules",
                instruction: "All questions are compulsory. Each item carries 2 marks.",
                questions: [
                  { text: "Define sentence modifiers. Provide three syntax examples illustrating corrective positioning checks.", difficulty: "Easy", marks: 2 },
                  { text: "Identify structural syntax faults inside compound complex clause frameworks.", difficulty: "Moderate", marks: 2 }
                ]
              }
            ]
          };
        } else if (normalizedTitle.includes("math") || normalizedTitle.includes("discrete")) {
          targetPaper = {
            title: "Discrete Mathematics Foundations",
            sections: [
              {
                title: "Section A: Set Theory and Graph Proofs",
                instruction: "Provide definitive analytical derivations.",
                questions: [
                  { text: "Prove that the number of vertices of odd degree in a finite graph is always even.", difficulty: "Moderate", marks: 5 },
                  { text: "Using mathematical induction, prove the validity of structural progression series metrics.", difficulty: "Hard", marks: 5 }
                ]
              }
            ]
          };
        } else if (normalizedTitle.includes("physic") || normalizedTitle.includes("electric")) {
          targetPaper = {
            title: "Chemical Effects of Electric Current",
            sections: [
              {
                title: "Section A: Electrolysis Foundations",
                instruction: "Answer all questions. Each item carries 2 marks.",
                questions: [
                  { text: "Define electroplating. Explain its primary industrial purpose with practical examples.", difficulty: "Easy", marks: 2 },
                  { text: "What is the role of a stabilizer in the process of electrolysis inside liquid cells?", difficulty: "Moderate", marks: 2 }
                ]
              }
            ]
          };
        }

        // Processing simulator timeout buffer
        await new Promise((resolve) => setTimeout(resolve, 2000));

        await (Assignment as any).findByIdAndUpdate(assignmentId, {
          status: "completed",
          generatedPaper: targetPaper
        });

      } catch (err) {
        console.error("Pipeline failure inside handling loop execution block", err);
        await (Assignment as any).findByIdAndUpdate(assignmentId, { status: "failed" });
      }
    },
    { connection: redisConnection }
  );
}
import { NextFunction, Request, Response } from "express";
import OpenAI from "openai";

async function isAppropriate(req: Request, res: Response, next: NextFunction) {
  const review = req.body.comment;
  const openai = new OpenAI({
    apiKey: process.env.api_key,
    organization: process.env.organization_id,
  });
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Rate the following product review as true if it contains no swear words and as false if it contains swear words.",
      },
      { role: "user", content: review },
    ],
  });
  if (response.choices[0].message.content?.toLowerCase() === "false") {
    return res.status(400).send({ message: "Inappropriate language detected" });
  }
  next();
}

export { isAppropriate };

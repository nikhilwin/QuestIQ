import os
import sys
import json
import argparse
from pydantic import BaseModel, Field
from typing import List
from pypdf import PdfReader

# Define output schema using Pydantic for Gemini Structured Outputs
class RepeatedTopic(BaseModel):
    topic: str = Field(description="The name of the subject topic that repeats in the question paper")
    frequency: int = Field(description="Estimated number of times questions from this topic appear in the paper")
    importance: str = Field(description="Importance level based on recurrence: 'High', 'Medium', or 'Low'")

class ExpectedQuestion(BaseModel):
    question: str = Field(description="An expected question that could be asked based on this topic's trend")
    topic: str = Field(description="The topic name this question belongs to")

class AnalysisResult(BaseModel):
    repeatedTopics: List[RepeatedTopic] = Field(description="List of the most repeated topics identified in the questions")
    expectedQuestions: List[ExpectedQuestion] = Field(description="List of highly anticipated/expected questions for practice")
    revisionPath: List[str] = Field(description="A step-by-step 7-day revision path schedule tailored for these topics")

def extract_text(file_path: str) -> str:
    _, ext = os.path.splitext(file_path.lower())
    if ext == '.txt':
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    elif ext == '.pdf':
        reader = PdfReader(file_path)
        text = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text.append(t)
        return "\n".join(text)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

def main():
    parser = argparse.ArgumentParser(description="Analyze PYQ documents using Gemini")
    parser.add_argument("--file", required=True, help="Path to the PDF/TXT question paper file")
    parser.add_argument("--exam", required=True, help="Name of the target exam")
    parser.add_argument("--subject", required=True, help="Name of the target subject")
    args = parser.parse_args()

    # Verify Gemini API key
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable is not set.", file=sys.stderr)
        sys.exit(1)

    try:
        # Extract text from document
        doc_text = extract_text(args.file)
        if not doc_text.strip():
            print("Error: Could not extract any text from the provided file.", file=sys.stderr)
            sys.exit(1)

        # Truncate text if excessively long to avoid payload size issues (keep first ~30k words / 150k characters)
        if len(doc_text) > 150000:
            doc_text = doc_text[:150000] + "\n[Content Truncated for token optimization...]"

        # Initialize Gemini Client
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = f"""
        You are QuestIQ's PYQ Intelligence Engine, an elite exam parser and syllabus analyst.
        
        Analyze the following examination text from past year papers (PYQs) for the "{args.exam}" exam in the subject "{args.subject}".
        
        Identify:
        1. The most repeated topics/themes across these questions. Tag each with a frequency count and an importance tier ('High', 'Medium', 'Low').
        2. Create 3 to 5 "Most Expected Questions" for the upcoming exam, referencing the themes that repeat the most.
        3. Formulate a personalized "Last 7 Days Revision Plan" that prioritizes these high-weightage topics.
        
        Syllabus Context / Input text to analyze:
        ---
        {doc_text}
        ---
        
        Return the result strictly formatted to the JSON schema.
        """

        # Call Gemini model
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AnalysisResult,
                temperature=0.2
            )
        )

        # Validate the response text is valid JSON (Gemini Structured Outputs should guarantee this)
        response_text = response.text.strip()
        
        # Verify it parses as JSON before printing to stdout
        json.loads(response_text)
        print(response_text)
        sys.exit(0)

    except Exception as e:
        print(f"Error during analysis: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

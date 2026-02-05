import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

llm = ChatGoogleGenerativeAI(
model="gemini-3-flash-preview",
google_api_key="AIzaSyBk-0ZaQgNJkvMfuvGDvr6IZRcKM-3d3-M",
)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", """
You are an expert information extraction assistant.

You will be given raw HTML from a job posting webpage.
Your task is to extract the following fields:

- company_name
- job_role
- job_description

Rules:
- Use ONLY the information present in the HTML
- Remove navigation menus, headers, footers, ads, and unrelated content
- The job_description should be clean, readable plain text
- If a field cannot be found, return null
- Output MUST be valid JSON
- Do NOT include markdown, explanations, or extra text
"""),
        ("human", "{html_content}"),
    ]
)

def extract_job_from_html(html: str) -> dict:
    chain = LLMChain(prompt=prompt, llm=llm)
    response = chain.run({"html_content": html})
    
    # Debug: print raw response first
    print("Raw LLM response:\n", response)

    # Parse JSON safely
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON returned by model:\n{response}")


if __name__ == "__main__":
    with open("example.txt", "r", encoding="utf-8") as f:
        html_content = f.read()

    result = extract_job_from_html(html_content)
    print(json.dumps(result, indent=2))

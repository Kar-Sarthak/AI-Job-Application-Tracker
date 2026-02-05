from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
import json

def main():
    llm = ChatGoogleGenerativeAI(
        model="gemini-3-flash-preview",
        google_api_key="AIzaSyBk-0ZaQgNJkvMfuvGDvr6IZRcKM-3d3-M",
    )

    # Read HTML
    with open("example.txt", "r", encoding="utf-8") as f:
        html_content = f.read()

    prompt = f"""
Extract the following from the HTML below and return ONLY valid JSON.

Fields:
- company_name
- job_role
- job_description

JSON format:
{{
  "company_name": "",
  "job_role": "",
  "job_description": ""
}}

HTML:
{html_content}
"""

    response = llm.invoke([HumanMessage(content=prompt)])

    # 🔑 FIX: Extract text safely
    if isinstance(response.content, list):
        text_output = response.content[0]["text"]
    else:
        text_output = response.content

    # Parse JSON
    try:
        parsed = json.loads(text_output)
        print(json.dumps(parsed, indent=2))
    except json.JSONDecodeError:
        print("❌ Invalid JSON returned:")
        print(text_output)

if __name__ == "__main__":
    main()

from flask import Flask, request, jsonify
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
import json
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)


llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    api_key="##########################################",
    base_url="https://openrouter.ai/api/v1",
    temperature=0
)


cluster = MongoClient(
    "mongodb+srv://#########################################"
)
db = cluster["jobs"]
collection = db["job_tracker"]


@app.route("/extract", methods=["POST"])
def extract_job():
    data = request.get_json()
    text_content = data.get("text", "")

    if not text_content:
        return jsonify({"error": "No text provided"}), 400

    prompt = f"""
You are given the plain text content of a job posting page.

Extract the following information and return ONLY valid JSON.

Fields:
- company_name
- job_role
- job_description

Instructions for job_description:
1. Identify sections such as Tech Requirements, Responsibilities, Qualifications, Skills, Benefits, or similar.
2. Include ALL text under each section.
3. Do NOT summarize, shorten, or reword anything.
4. Preserve bullet points and line breaks as plain text.
5. Escape quotes and special characters to produce valid JSON.
6. Return ONLY valid JSON — no explanations or extra text.

JSON format:
{{
  "company_name": "",
  "job_role": "",
  "job_description": ""
}}

PAGE TEXT:
{text_content}
"""


    response = llm.invoke([HumanMessage(content=prompt)])
    text_output = response.content

    try:
        parsed_json = json.loads(text_output)

       
        job_doc = {
            "company_name": parsed_json.get("company_name", ""),
            "job_role": parsed_json.get("job_role", ""),
            "job_description": parsed_json.get("job_description", ""),
            "status": "Applied",
            "date": datetime.now().strftime("%Y-%m-%d")
        }


        collection.insert_one(job_doc)

        return jsonify(parsed_json)

    except json.JSONDecodeError:
        return jsonify({
            "error": "Invalid JSON returned by model",
            "raw_output": text_output
        }), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)

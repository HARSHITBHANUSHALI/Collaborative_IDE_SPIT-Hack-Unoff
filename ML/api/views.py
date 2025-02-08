from django.shortcuts import render
from django.http import JsonResponse
import google.generativeai as genai
import json
from django.views.decorators.csrf import csrf_exempt 
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the model
model = genai.GenerativeModel('gemini-pro')

@csrf_exempt
def autocomplete(request):
    try:
        data = json.loads(request.body)
        code = data.get("code")
        cursor_line = data.get("cursor_line")
        language = data.get("language")
        # Format prompt
        prompt = f"""You are an intelligent and smart AI code assistant. You will be given a piece of code along with the cursor position. 
Your task is to generate only the next line of code that logically follows. 
Do not include explanations, comments, or extra text—only the next line.
Language of the code:
{language}

Code:
{code}

Cursor is at line {cursor_line}. Predict the next line of code:
"""

        # Generate response using Gemini
        response = model.generate_content(prompt)
        
        # Extract the suggested code from the response
        suggested_code = response.text.strip()
        
        return JsonResponse({
            "suggested_code": suggested_code
        })

    except Exception as e:
        return JsonResponse({
            "error": str(e)
        }, status=500)
    

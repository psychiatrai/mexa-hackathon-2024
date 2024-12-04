import json
import os
from typing import Annotated, Literal, Optional, TypedDict

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv("secrets.env")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI(
    title="psychiatrai - MEXA chat backend",
    docs_url="/",
    description="This API allows you to chat with an AI model using WebSocket connections",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")


class GenerationSchema(TypedDict):
    generated_analysis: Optional[str]
    generated_followup_question: str
    generated_explanation: Optional[str]
    diagnosis: Optional[str]
    selected_questionnaire: Optional[str]
    estimated_questionnaire_scores: Optional[str]
    terminate_chat: Optional[bool]


generation_config = genai.GenerationConfig(
    response_mime_type="application/json", response_schema=GenerationSchema
)


class OutputModel(GenerationSchema):
    type: Literal["text", "audio"]
    

initial_prompt_prefix: str = """You are a clinical psychologist specializating in mental health mesaurement. Your goal is to give a possible set of initial diagnosis along with its severity, within 10 questions (think of it as a short session). At the end, you should also give an estimated score on all individual items for a questionnaire for the most applicable diagnoses (such as PHQ-9 if depression is detected as the most likely condition). The diagnosis categories are: Depressive Disorder, Anxiety Disorder, Trauma, ADHD, OCD, Other, and No Condition. Your first question is "Hey. How are you feeling today?". """

initial_prompt_suffix: str = """ Please analyze this and provide an analysis (generated_analysis), and a followup question that would help us get towards our goal (generated_followup_question). If you are ready to terminate the chat, please set the terminate_chat field to true. In that case, please provide a diagnosis, selected_questionnaire, and estimated_questionnaire_scores. If not ready to terminate, please set the fields diagnosis, selected_questionnaire, and estimated_questionnaire_scores to null. In case you are terminating chat, in the generated_explanation field, please indicate the explanation for your diagnosis. If case you are not terminating chat, in the generated_explanation field, please indicate the explanation for your generated_analysis and generated_followup_question. """

initial_prompt_text: str =  f"{initial_prompt_prefix}The user has responsed PLACEHOLDER_TEXT to this.{initial_prompt_suffix}"""
initial_prompt_audio: str = f"{initial_prompt_prefix}The user has responsed with the attached audio to this.{initial_prompt_suffix}"
initial_prompt_video: str = f"{initial_prompt_prefix}The user has responsed with the attached video to this.{initial_prompt_suffix}"


@router.post("/receive_input", response_model=OutputModel)
async def receive_input(
    type: Annotated[Literal["text", "audio", "video"], Form],
    text_content: Optional[str] = Form(None),
    file_content: Optional[UploadFile] = File(None),
    session_id: str = Form(None),
    message_number: int = Form(None),
):
    if type == "text":
        response = model.generate_content(
            initial_prompt_text.replace("PLACEHOLDER_TEXT", f'"{text_content}"'),
            generation_config=generation_config,
        )
    elif type == "audio":
        response = model.generate_content(
            [file_content, initial_prompt_audio],
            generation_config=generation_config,
        )
    elif type == "video":
        response = model.generate_content(
            [file_content, initial_prompt_video],
            generation_config=generation_config,
        )

    structured_response = json.loads(response.text)

    print(structured_response)

    output_response = OutputModel(
        type="text",
        generated_analysis=structured_response.get("generated_analysis", None),
        generated_followup_question=structured_response.get("generated_followup_question", None),
        generated_explanation=structured_response.get("generated_explanation", None),
        diagnosis=structured_response.get("diagnosis", None),
        selected_questionnaire=structured_response.get("selected_questionnaire", None),
        estimated_questionnaire_scores=structured_response.get("estimated_questionnaire_scores", None),
        terminate_chat=structured_response.get("terminate_chat", False)
    )

    return output_response


app.include_router(router, prefix="/api")

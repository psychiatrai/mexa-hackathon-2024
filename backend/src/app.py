import json
import os
from typing import Annotated, List, Literal, Optional, TypedDict

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

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
model = genai.GenerativeModel("gemini-1.5-pro")


class GenerationSchema(TypedDict):
    generated_analysis: Optional[str]
    generated_followup_response: str
    generated_explanation: Optional[str]
    likely_conditions: Optional[List[Literal["Depression", "Anxiety", "Trauma", "Other", "NoCondition"]]]
    selected_questionnaire: Optional[Literal["PHQ-9", "GAD-7", "IES-R"]]
    estimated_questionnaire_scores: Optional[str]
    terminate_chat: Optional[bool]


generation_config = genai.GenerationConfig(
    response_mime_type="application/json", response_schema=GenerationSchema
)


class OutputModel(GenerationSchema):
    type: Literal["text", "audio"]
    

initial_prompt_prefix: str = """
    You are a clinical psychologist specializating in mental health mesaurement. Your goal is to give a possible set of initial screening along with its severity, within a maximum of 15 questions (think of it as a short session).
    
    Please consider only the 3 conditions listed below as well as the 2 fields Other and No Condition. The categories are:
        - Depression
        - Anxiety
        - Trauma
        - Other
        - No condition
    
    As part of only the last reponse, you should also give an estimated score on all individual items for a questionnaire for the most likely condition. Please use only these questionnaires:
        - Patient Health Questionnaire-9 (PHQ-9) for Depression
        - Generalized Anxiety Disorder-7 (GAD-7) for Anxiety
        - Impact of Event Scale-Revised (IES-R) for Trauma
    * The selected questionnaire is in the variable selected_questionnaire, and the item by item estimated scores for that questionnaire are in the variable estimated_questionnaire_scores. The estimated scores should be in the format of "item1:score1, item2:score2, ...". The items are the same as the items in the questionnaires. The scores are the estimated scores for each of the items. The items are in the same order as in the questionnaires.

    At this point, you have asked 0 questions.
    Your first question is "Hey. How are you feeling today?"
    """

prompt_suffix: str = """
    Please analyze this response (focus more on the later question but also keep the context of the whole conversation in mind) and provide an analysis (generated_analysis), and a followup response that would help us get towards our goal (generated_followup_response). In the generated_explanation field, please indicate the explanation for your generated_analysis and generated_followup_response.
    If you are ready to terminate the chat, please set the terminate_chat field to true. In that case, please provide the likely_conditions, selected_questionnaire, and estimated_questionnaire_scores. 
    If not ready to terminate the chat, please set the fields likely_conditions, selected_questionnaire, and estimated_questionnaire_scores to null. 
    In case you are terminating chat, in the generated_explanation field, please indicate the explanation for your diagnosis.

    The follow up response should reflect and comment on the users last response first, and then ask a question. The question should be in casual language, and not use formal questionnaires like language. It should help you get more information about the user's mental health

    Please give structured response according to the schema provided:

    ```
        class GenerationSchema(TypedDict):
        generated_analysis: Optional[str]
        generated_followup_response: str
        generated_explanation: Optional[str]
        likely_conditions: Optional[List[Literal["Depression", "Anxiety", "Trauma", "Other", "NoCondition"]]]
        selected_questionnaire: Optional[Literal["PHQ-9", "GAD-7", "IES-R"]]
        estimated_questionnaire_scores: Optional[str]
        terminate_chat: Optional[bool]
    ```

    And explanation of the fields is given below:

        - generated_analysis: (Always required) - This is the analysis of the user response
        - generated_followup_response: (Always required) - This is the followup question to ask the user. This should reflect and comment on the user response to the last question, as well as have a definite follow up question.
        - generated_explanation: (Always required) - This is the explanation for the generated_analysis and generated_followup_response
        - likely_conditions: (Only required for the last response) - A list of conditions that are likely for the user
        - selected_questionnaire: (Only required for the last response) - The selected questionnaire for the most likely condition
        - estimated_questionnaire_scores: (Only required for the last response) - The estimated scores for each of the items of the selected_questionnaire
        - terminate_chat: (Always required) - True for the last reponse, False otherwise. Use this to indicate that you are ready to make the initial screening and terminate the chat

    Please rememeber that you can ask a maximum of 15 questions.
    """

initial_prompt_text: str =  f"{initial_prompt_prefix}. The user has responsed PLACEHOLDER_TEXT_INITIAL_RESPONSE to this. {prompt_suffix}."""
initial_prompt_audio: str = f"{initial_prompt_prefix}. The user has responsed with the attached audio to this. {prompt_suffix}"
initial_prompt_video: str = f"{initial_prompt_prefix}. The user has responsed with the attached video to this. At this point, you have asked 1 question. {prompt_suffix}"

second_and_later_prompts_part_1: str = """After this, you asked the followup question: "PLACEHOLDER_TEXT_FOLLOWUP_RESPONSE"."""
second_and_later_prompts_part_2: str = f"""
    To this, the user_responsed: "PLACEHOLDER_TEXT_LATER_RESPONSE".

    {prompt_suffix}

    At this point, you have asked PLACEHOLDER_TEXT_NUM_QUESTIONS questions.
    """

message_history = []


@router.post("/receive_input", response_model=OutputModel)
async def receive_input(
    type: Annotated[Literal["text", "audio", "video"], Form],
    text_content: Optional[str] = Form(None),
    file_content: Optional[UploadFile] = File(None),
    session_id: str = Form(None),
    message_number: int = Form(None),
):
    if type == "text":
        if message_number == 0:
            initial_prompt = initial_prompt_text.replace("PLACEHOLDER_TEXT_INITIAL_RESPONSE", f'"{text_content}"')
            initial_prompt += f"At this point, you have asked {message_number + 1} questions."
            message_history.append(initial_prompt)
        elif message_number > 0:
            answer_received = second_and_later_prompts_part_2.replace("PLACEHOLDER_TEXT_LATER_RESPONSE", f'{text_content}')
            later_prompt_suffix = answer_received.replace("PLACEHOLDER_TEXT_NUM_QUESTIONS", f'{message_number + 1}')
            message_history.append(later_prompt_suffix)
        
        content_to_send = ("\n").join(message_history)
        response = model.generate_content(
            content_to_send,
            generation_config=generation_config,
        )
    elif type == "audio":
        message_history.append(initial_prompt_audio)
        response = model.generate_content(
            initial_prompt_audio,
            {
                "mime_type": "audio/webm",
                "content": await file_content.read(),
            },
            generation_config=generation_config,
        )
    elif type == "video":
        response = model.generate_content(
            [file_content, initial_prompt_video],
            generation_config=generation_config,
        )

    print(response.text)

    structured_response = json.loads(response.text)
    print(structured_response)

    if message_number > 0:
        followup_response = structured_response.get("generated_followup_response", None)
        if followup_response:
            followup_response_asked = second_and_later_prompts_part_1.replace("PLACEHOLDER_TEXT_FOLLOWUP_RESPONSE", f'{followup_response}')
            message_history.append(followup_response_asked)

    output_response = OutputModel(
        type="text",
        generated_analysis=structured_response.get("generated_analysis", None),
        generated_followup_response=structured_response.get("generated_followup_response", None),
        generated_explanation=structured_response.get("generated_explanation", None),
        likely_conditions=structured_response.get("likely_conditions", None),
        selected_questionnaire=structured_response.get("selected_questionnaire", None),
        estimated_questionnaire_scores=structured_response.get("estimated_questionnaire_scores", None),
        terminate_chat=structured_response.get("terminate_chat", False)
    )

    return output_response


app.include_router(router, prefix="/api")

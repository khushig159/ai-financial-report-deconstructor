from fastapi import FastAPI, File, UploadFile
import fitz

app=FastAPI()

@app.get("/")

def read_root():
    return {"message":"AI Service is running"}

@app.post("/parse-pdf")
async def parse_pdf(file:UploadFile=File(...)):
    pdf_bytes=await file.read()
    doc=fitz.open(stream=pdf_bytes,filetype='pdf')
    full_text=''
    for page in doc:
        full_text+=page.get_text()
    doc.close()

    return{
        "filename":file.filename,
        "text":full_text
    }


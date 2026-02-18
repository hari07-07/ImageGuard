import cv2
from PIL import Image
from model import predict_image

def analyze_video(video_path):
    cap = cv2.VideoCapture(video_path)

    predictions = []
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % 15 == 0:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(rgb)

            result, confidence = predict_image(pil_image)
            predictions.append((result, confidence))

        frame_count += 1

    cap.release()

    if not predictions:
        return "Error", 0

    ai_count = sum(1 for p in predictions if p[0] != "Real")
    real_count = len(predictions) - ai_count

    final_result = "Deepfake" if ai_count > real_count else "Real"
    avg_confidence = sum(p[1] for p in predictions) / len(predictions)

    return final_result, round(avg_confidence, 2)

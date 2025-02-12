import numpy as np
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)
CORS(app)

# Sample data: AQI levels and corresponding disease risks
data = {
    "AQI": [50, 75, 100, 125, 150, 175, 200, 250, 300, 400],
    "Asthma": [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    "Heart Disease": [0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    "Lung Cancer": [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    "Brain Damage": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
}

df = pd.DataFrame(data)
X = df[["AQI"]]
y = df.drop(columns=["AQI"])

# Train and save the model (only if not already trained)
MODEL_PATH = "air_quality_model.pkl"

try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully.")
except:
    print("⚠️ No pre-trained model found. Training a new one...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    joblib.dump(model, MODEL_PATH)
    print("✅ Model trained and saved.")

# API route to handle predictions
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get AQI value from request
        input_data = request.json
        aqi_value = input_data.get("aqi")

        if aqi_value is None:
            return jsonify({"error": "AQI value is required"}), 400

        # Validate AQI input
        try:
            aqi_value = float(aqi_value)
        except ValueError:
            return jsonify({"error": "Invalid AQI value. Must be a number."}), 400

        # Predict disease risks
        prediction = model.predict(np.array([[aqi_value]]))
        diseases = y.columns.tolist()
        predicted_diseases = [diseases[i] for i in range(len(diseases)) if prediction[0][i] == 1]

        return jsonify({"aqi": aqi_value, "predicted_diseases": predicted_diseases})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

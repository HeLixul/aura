import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Load the dataset
data = pd.read_csv("air_quality_health_impact_data.csv")  # Replace with your actual CSV file

# Select only necessary features
features = ["AQI", "PM10", "PM2_5", "NO2", "SO2", "O3"]
X = data[features]

# Target variables
y_reg = data["HealthImpactScore"]  # Regression target
y_class = data["HealthImpactClass"]  # Classification target

# Encode the HealthImpactClass labels
label_encoder = LabelEncoder()
y_class_encoded = label_encoder.fit_transform(y_class)

# Train-test split (80% training, 20% testing)
X_train, X_test, y_reg_train, y_reg_test, y_class_train, y_class_test = train_test_split(
    X, y_reg, y_class_encoded, test_size=0.2, random_state=42
)

# Train the regression model (Predicting Health Impact Score)
regressor = RandomForestRegressor(n_estimators=100, random_state=42)
regressor.fit(X_train, y_reg_train)

# Train the classification model (Predicting Health Impact Class)
classifier = RandomForestClassifier(n_estimators=100, random_state=42)
classifier.fit(X_train, y_class_train)

# Save the models
joblib.dump(regressor, "health_score_model.pkl")
joblib.dump(classifier, "health_class_model.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")

print("Models trained and saved successfully!")

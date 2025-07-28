"""
predict.py
Loads a trained CatBoost regression model and predicts the target price for a given cryptocurrency and price.
Usage: python predict.py <coin> <price>
"""

import sys
import pandas as pd
import joblib

# Parse command-line arguments
coin, price = sys.argv[1], float(sys.argv[2])

# Load the trained model
model = joblib.load("model.pkl")

# Prepare input data for prediction
input_df = pd.DataFrame([{"coin": coin, "price": price}])
input_df = pd.get_dummies(input_df).reindex(columns=model.feature_names_, fill_value=0)

# Make prediction
pred = model.predict(input_df)[0]
print(round(pred, 2))

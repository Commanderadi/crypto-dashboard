"""
train_model.py
Trains a CatBoost regression model to predict the target price of a cryptocurrency based on its name and current price.
Saves the trained model to 'model.pkl'.
"""

import pandas as pd
from catboost import CatBoostRegressor
import joblib

# Example training data
# 'coin': cryptocurrency name
# 'price': current price
# 'target': target price to predict

data = pd.DataFrame({
    'coin': ['bitcoin', 'ethereum', 'solana', 'dogecoin'],
    'price': [60000, 4000, 150, 0.5],
    'target': [62000, 4200, 170, 0.55]
})

# Convert categorical 'coin' column to one-hot encoding

data = pd.get_dummies(data, columns=['coin'])

# Features and target
X = data.drop("target", axis=1)
y = data["target"]

# Initialize and train the CatBoost regressor
model = CatBoostRegressor(verbose=0)
model.fit(X, y)

# Save the trained model to a file
joblib.dump(model, "model.pkl")

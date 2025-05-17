import pandas as pd
import numpy as np
import csv

# Read the cities file
with open('data/cities.txt', 'r') as f:
    cities = [line.strip().replace('\"', '').replace(',', '') for line in f if line.strip()]

# Read the patient data
df = pd.read_csv('data/patient data.csv')

# Replace locations with random cities
df['location'] = np.random.choice(cities, size=len(df))

# Save the updated data
df.to_csv('data/patient data.csv', index=False, quoting=csv.QUOTE_ALL)

print(f'Updated {len(df)} patient records with random cities from {len(cities)} options.') 
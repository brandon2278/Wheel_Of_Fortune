"""
  This routine contains code to determine if a username or message contains
  profanity. The routine require scikit-learn. The script should be ran server side.
  This script uses Linear Support Vector Machine (SVM). The Linear SVM model was chosen
  primality because it can be ran in real-time.
 
  Author(s): Colby O'Keefe
"""
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.calibration import CalibratedClassifierCV
from sklearn.svm import LinearSVC
import pandas as pd
import numpy as np
import pickle

# Initilzes the model abd vectorizer
model, vectorizer = None, None

# Opens the model and vectorizer
with open('model.pkl', 'rb') as file:
    model = pickle.load(file)
with open('vectorize.pkl', 'rb') as file:
    vectorizer = pickle.load(file)

""""
    !!! Should Never Be Called Unless Retaining the model !!!
"""
def Train():
    # Loads Training data
    trainingData = pd.read_csv('clean_data.csv')
    texts = trainingData['text'].astype(str)
    y = trainingData['is_offensive']

    # Vectorize the training texts
    vectorizer = CountVectorizer(stop_words='english', min_df=0.0001)
    x = vectorizer.fit_transform(texts)
    
    
    # Trains the model
    model = LinearSVC(class_weight='balanced', dual=False, tol=1e-2, max_iter=1e5)
    cclf = CalibratedClassifierCV(base_estimator=model)
    cclf.fit(x, y)
    
    print(cclf.predict(vectorizer.transform(["fuck you"])))

    #saves the trained model and vectorizer to a pickle file
    with open('model.pkl', 'wb') as file:
        pickle.dump(cclf, file)    

    with open('vectorize.pkl', 'wb') as file:
        pickle.dump(vectorizer, file)

    print("Training Completed!!!")
    
"""
	Returns the Proability of the text not being profane
"""
def notProfaneProb(prob):
    return prob[0]

"""
	Returns the Proability of the text being profane
"""
def profaneProb(prob):
    return prob[1]

"""
	Returns 1 if the text is profane and 0 otherwise
"""
def predict(texts):
    return model.predict(vectorizer.transform(texts))

"""
	Returns the proability of the text being profane
"""
def predict_prob(texts):
    return np.apply_along_axis(profaneProb, 1, model.predict_proba(vectorizer.transform(texts)))


"""
	Trains the data if the script is ran as main
"""
if __name__ == '__main__':
    Train()



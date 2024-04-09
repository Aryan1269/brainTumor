import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from keras.utils import to_categorical
from keras.layers import Input
from keras.models import Sequential
from keras.layers import Dense, Flatten

# Define the input size of the images
INPUT_SIZE = 64

# Define the directory where the images are stored
image_directory = 'C://Users//aryan//Desktop//braintumor//smallTrain//'

# Define the tumor types
tumor_types = ['no_tumor', 'meningioma_tumor', 'glioma_tumor', 'pituitary_tumor']

# Initialize the dataset and labels lists
dataset = []
labels = []

# Loop over the tumor types
for tumor_type_index, tumor_type in enumerate(tumor_types):
    # Get the list of image file names for the current tumor type
    images_path = os.listdir(image_directory + '/' + tumor_type)
    
    # Loop over the image file names
    for i, image_name in enumerate(images_path):
        # Check if the image is a JPEG image
        if image_name.split('.')[1] == 'jpg':
            # Load the image
            image = cv2.imread(image_directory + '/' + tumor_type + '/' + image_name)
            # Resize the image to the input size
            image = cv2.resize(image, (INPUT_SIZE, INPUT_SIZE))
            # Convert the image to a numpy array
            image = np.array(image)
            # Add the image to the dataset
            dataset.append(image)
            # Add the tumor type index to the labels
            labels.append(tumor_type_index)

# Convert the dataset and labels to numpy arrays
dataset = np.array(dataset)
labels = np.array(labels)

# Split the dataset and labels into training and testing sets
x_train, x_test, y_train, y_test = train_test_split(dataset, labels, test_size=0.4, random_state=0)

# Normalize the pixel values of the images
x_train = x_train / 255.0
x_test = x_test / 255.0

# Convert the labels to categorical labels
y_train = to_categorical(y_train, num_classes=len(tumor_types))
y_test = to_categorical(y_test, num_classes=len(tumor_types))

# Define the input layer
input_layer = Input(shape=(INPUT_SIZE, INPUT_SIZE, 3))

# Define the model
model = Sequential()
model.add(Flatten(input_shape=input_layer.shape[1:]))
model.add(Dense(64, activation='relu'))
model.add(Dense(64, activation='relu'))
model.add(Dense(len(tumor_types), activation='softmax'))

# Compile the model
model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# Evaluate the model on the testing data
score = model.evaluate(x_test, y_test, verbose=0)

# Print the accuracy of the model on the testing data
print('Testing Accuracy:', score[1])

# Train the model
history = model.fit(x_train, y_train,
          batch_size=20,
          verbose=1,
          epochs=20,
          validation_data=(x_test, y_test),
          shuffle=False)

# Save the model
model.save('BrainTumorTypes_ANN.keras')
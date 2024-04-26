
import keras

import cv2
import os
import tensorflow as tf
from tensorflow import keras
from PIL import Image
import numpy as np
from sklearn.model_selection import train_test_split
from keras.utils import normalize
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D
from keras.layers import Activation, Dropout, Flatten, Dense
from keras.utils import to_categorical

image_directory = 'C://Users//aryan//Desktop//braintumor//smallTrain//'
tumor_types = ['no_tumor', 'meningioma_tumor', 'glioma_tumor', 'pituitary_tumor']
dataset = []
labels = []
INPUT_SIZE = 64

# Set the environment variable to fix the warning message
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

for tumor_type_index, tumor_type in enumerate(tumor_types):
    images_path = os.listdir(image_directory + tumor_type)
    for i, image_name in enumerate(images_path):
        if image_name.split('.')[1] == 'jpg':
            image = cv2.imread(image_directory + tumor_type + '/' + image_name)
            image = Image.fromarray(image, 'RGB')
            image = image.resize((INPUT_SIZE, INPUT_SIZE))
            dataset.append(np.array(image))
            labels.append(tumor_type_index)

dataset = np.array(dataset)
labels = np.array(labels)

x_train, x_test, y_train, y_test = train_test_split(dataset, labels, test_size=0.4, random_state=0)

x_train = normalize(x_train, axis=1)
x_test = normalize(x_test, axis=1)

y_train = to_categorical(y_train, num_classes=len(tumor_types))
y_test = to_categorical(y_test, num_classes=len(tumor_types))

# Define the input layer
input_layer = Input(shape=(INPUT_SIZE, INPUT_SIZE, 3))

# Define the model
model = Sequential()
model.add(Conv2D(32, (3, 3), input_shape=input_layer.shape[1:])) # type: ignore
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Conv2D(32, (3, 3), kernel_initializer='he_normal'))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Conv2D(64, (3, 3), kernel_initializer='he_normal'))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Flatten())
model.add(Dense(64))
model.add(Activation('relu'))
model.add(Dropout(0.5))
model.add(Dense(len(tumor_types)))
model.add(Activation('softmax'))

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
model.save('BrainTumorTypes.keras')

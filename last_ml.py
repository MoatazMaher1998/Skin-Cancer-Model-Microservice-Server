import tensorflow as tf
import cv2
import numpy as np
import keras
from tensorflow.keras.models import Model
from keras.layers import Activation, Dropout, Flatten, Dense,Input
import sys
print("im in python")
def INCV3():
  base_model =tf.keras.applications.InceptionV3(
                  include_top=False,
                  weights=None,
                  input_tensor=None,
                  input_shape=(224,224,3),
                  pooling='avg',
                  classes=1000,
                  classifier_activation="softmax",
                )
  x=base_model.output
  x = Dense(3, activation='softmax')(x)
  model = Model(inputs = base_model.input, outputs = x)

  return model
model=INCV3()
model = keras.models.load_model('./w.h5')

#img = cv2.imread('/content/drive/MyDrive/Kaggle/Dataset/Test/normal/NORMAL (1030).png')/255 
#img = cv2.imread('/content/drive/MyDrive/Kaggle/Dataset/Test/covid-19/COVID (1046).png')/255 
#img = cv2.imread('/content/drive/MyDrive/Kaggle/Dataset/Test/Viral Pneumonia/Viral Pneumonia (101).png')/255 
img = cv2.imread(sys.argv[1]) / 255 
img_modify_size = cv2.resize(img,(224,224))
img_modify_shape = img_modify_size.reshape(1,224,224,3)
result = model(img_modify_shape)
a ,b ,c = result[0][0].numpy(),result[0][1].numpy(),result[0][2].numpy()
per_viral, per_covid, per_normal = a*100, b*100, c*100

#print(per_viral,per_covid,per_normal)
answer = max(per_viral,per_covid,per_normal)
if answer == per_viral:
  #print("Virual with accuarcy = ",per_viral)
  print("Your Result is: %.2f" % round(per_viral, 2) + "%","Viral Pneumonia")
elif answer == per_covid:
  #print("covid with accuarcy = ",per_covid)
  print("Your Result is: %.2f" % round(per_covid, 2) + "%","Covid-19")
else:  
  #print("normal with accuarcy = ",per_normal)
  print("Your Result is: %.2f" % round(per_normal, 2) + "%","Normal")
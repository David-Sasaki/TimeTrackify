from pymongo import MongoClient
from pymongo.collection import ReturnDocument
from bson import ObjectId
import os

# MongoDB connection
client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017'))
db = client['TimeTrackify']
projects_collection = db.projects
tasks_collection = db.tasks

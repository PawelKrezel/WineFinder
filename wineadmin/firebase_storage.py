import uuid
from firebase_admin import storage

def upload_image(file):
    bucket = storage.bucket()

    filename = f"wine_images/{uuid.uuid4()}_{file.name}"

    blob = bucket.blob(filename)
    blob.upload_from_file(file, content_type=file.content_type)
    blob.make_public()
    return blob.public_url
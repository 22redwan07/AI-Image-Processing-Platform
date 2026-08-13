import os
import shutil
from config import Config

class CloudStorage:
    @staticmethod
    def save_file(local_path, remote_path=None):
        cloud_folder = os.path.join(os.getcwd(), 'cloud_storage')
        os.makedirs(cloud_folder, exist_ok=True)
        if remote_path is None:
            remote_path = os.path.basename(local_path)
        dest = os.path.join(cloud_folder, remote_path)
        shutil.copy2(local_path, dest)
        return dest

    @staticmethod
    def get_file(remote_path):
        cloud_folder = os.path.join(os.getcwd(), 'cloud_storage')
        return os.path.join(cloud_folder, remote_path)

    @staticmethod
    def upload_to_s3(local_path, bucket, key):
        raise NotImplementedError("S3 not configured yet")

    @staticmethod
    def upload_to_azure(local_path, container, blob):
        raise NotImplementedError("Azure not configured yet")

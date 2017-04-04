"""
This script load the docker image,
buid and run the code on the image
"""

import uuid
import os
import shutil
import docker

from docker.errors import *

client = docker.from_env()

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
TEMP_BUILD_DIR = "%s/TMP" % CURRENT_DIR

IMAGE_NAME = "flyingloong/coj_executor"

SOURCE_FILE_NAMES = {
    "java": "Example.java",
    "python": "example.py"
}
BINARY_NAMES = {
    "java": "Example",
    "python": "example.py"
}
BUILD_COMMAND_NAMES = {
    "java": "javac",
    "python": "python"
}
EXECUTE_COMMANDS = {
    "java": "java",
    "python": "python"
}

def load_image():
    """
    Check if the docker image can be found locally.
    If not, load it from DockerHub
    """
    try:
        client.images.get(IMAGE_NAME)
    except ImageNotFound:
        print "Image not found locally, loading from DockerHub..."
        client.images.pull(IMAGE_NAME)
    except APIError:
        print "Image not found locally, DockerHub is not accessible!"
        return
    print "Image [%s] is loaded." % (IMAGE_NAME)

def build_and_run(code, lang):
    """
    Docker operations
    """
    result = {'build': None, 'run': None, 'error': None}
    source_file_parent_dir_name = uuid.uuid4()
    source_file_host_dir = "%s/%s" % (TEMP_BUILD_DIR, source_file_parent_dir_name)
    source_file_guest_dir = "/test/%s" % (source_file_host_dir)
    make_dir(source_file_host_dir)

    try:
        with open("%s/%s" % (source_file_host_dir, SOURCE_FILE_NAMES[lang]), "w") as source_file:
            source_file.write(code)

        client.containers.run(
            image=IMAGE_NAME,
            command="%s %s" % (BUILD_COMMAND_NAMES[lang], SOURCE_FILE_NAMES[lang]),
            volumes={source_file_host_dir: {'bind': source_file_guest_dir, 'mode': 'rw'}},
            working_dir=source_file_guest_dir
        )
        print "Source built"
        result['build'] = "OK"
    except ContainerError as err:
        print "Build failed"
        result['build'] = err.stderr
        shutil.rmtree(source_file_host_dir)
        return result

    try:
        log = client.containers.run(
            image=IMAGE_NAME,
            command="%s %s" % (EXECUTE_COMMANDS[lang], BINARY_NAMES[lang]),
            volumes={source_file_host_dir: {'bind': source_file_guest_dir, 'mode': 'rw'}},
            working_dir=source_file_guest_dir
        )
        print "Executed"
        result['run'] = log
    except ContainerError as err:
        print "Execution failed"
        result['run'] = err.stderr
        shutil.rmtree(source_file_host_dir)
        return result

    shutil.rmtree(source_file_host_dir)
    return result

def make_dir(directory):
    """
    Make a sub directory on current directory
    """
    try:
        os.mkdir(directory)
        print "Tempory build directory [%s] created!" % directory
    except OSError:
        print "Tempory build directory [%s] exists!" % directory

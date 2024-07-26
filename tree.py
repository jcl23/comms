import os

def list_directory_tree(root_dir, exclude_dirs=None, prefix='', file_handle=None):
    if exclude_dirs is None:
        exclude_dirs = set()

    try:
        entries = os.listdir(root_dir)
    except PermissionError:
        return  # Skip directories where permission is denied

    # Exclude the specified directories
    entries = [entry for entry in entries if entry not in exclude_dirs]

    for entry in entries:
        entry_path = os.path.join(root_dir, entry)
        if os.path.isdir(entry_path):
            # Write directory paths with proper indentation to file
            file_handle.write(prefix + entry + '\n')
            # Recurse into subdirectories
            list_directory_tree(entry_path, exclude_dirs, prefix + '    ', file_handle)
        else:
            # Write file paths with proper indentation to file
            file_handle.write(prefix + entry + '\n')

# Define the root directory and excluded directories
root_directory = 'C:/Users/justi/Desktop/cs2/comms'
excluded_directories = {'node_modules', 'dist', '.git'}

# Define the output file
output_file = 'directory_structure.txt'

# Open the file for writing
with open(output_file, 'w') as file:
    list_directory_tree(root_directory, excluded_directories, file_handle=file)

print(f"Directory structure has been written to {output_file}")

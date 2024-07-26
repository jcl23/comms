import numpy as np
import json

def inverse_transform(a, b, c, d, e, f):
    # Create the matrix
    M = np.array([
        [a, b, c],
        [d, e, f],
        [0, 0, 1]
    ])

    # Compute the determinant of the 2x2 upper-left submatrix
    det = a * e - b * d

    if det == 0:
        raise ValueError("The transformation matrix is not invertible.")

    # Compute the inverse matrix
    inv_M = np.array([
        [e / det, -b / det, (b * f - c * e) / det],
        [-d / det, a / det, (c * d - a * f) / det],
        [0, 0, 1]
    ])

    # Extract the 6-tuple from the inverse matrix
    a_inv, b_inv, c_inv = inv_M[0]
    d_inv, e_inv, f_inv = inv_M[1]

    return a_inv, b_inv, c_inv, d_inv, e_inv, f_inv

def read_transforms_from_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        return data

def write_transforms_to_json(file_path, transforms):
    with open(file_path, 'w') as file:
        json.dump(transforms, file, indent=4)

def compute_all_inverses(input_file, output_file):
    # Read transformations from the JSON file
    transforms = read_transforms_from_json(input_file)

    # Compute inverses for each transformation
    inverse_transforms = {}
    for map_name, params in transforms.items():
        if len(params) != 6:
            raise ValueError(f"Invalid number of parameters for {map_name}. Expected 6.")
        a, b, c, d, e, f = params
        a_inv, b_inv, c_inv, d_inv, e_inv, f_inv = inverse_transform(a, b, c, d, e, f)
        inverse_transforms[map_name] = [a_inv, b_inv, c_inv, d_inv, e_inv, f_inv]

    # Write the inverse transformations to a JSON file
    write_transforms_to_json(output_file, inverse_transforms)
    print(f'Inverse transformations written to {output_file}')

# Example usage
input_file = '../data/iconToPositions.json'
output_file = '../data/positionToIcon.json'
compute_all_inverses(input_file, output_file)

# Smart Attendance System

A Python-based face recognition system for automated attendance tracking with a graphical user interface. The system uses OpenCV for face detection and recognition, implementing a custom similarity-based approach for face matching.

## Features

- Real-time face detection and recognition
- User-friendly graphical interface
- Add new faces through the GUI
- Automatic attendance marking
- Attendance history tracking
- Preview of captured faces
- Simple CSV-based attendance storage

## Requirements

- Python 3.8+
- OpenCV (opencv-python) 4.8.1
- NumPy 1.24.3
- Pillow 10.0.0
- tkinter (usually comes with Python)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Uditjhanjhariya/face-recognition-attendance.git
cd face-recognition-attendance
```

2. Install the required packages:
```bash
pip install -r requirements.txt
```

## Usage

1. Run the main application:
```bash
python main.py
```

2. Using the System:
   - Click "Start Camera" to begin the video feed
   - Click "Add Face" to register a new person
   - Enter the person's name when prompted
   - The system will automatically detect and recognize registered faces
   - Attendance is marked automatically when a face is recognized with high confidence

## Project Structure

```
smart-attendance-system/
│
├── main.py                 # Main GUI application with face recognition
├── utils/
│   └── face_utils.py      # Face detection and recognition utilities
├── known faces/           # Directory storing known face images
├── attendance.csv         # Attendance records
└── requirements.txt       # Project dependencies
```

## How It Works

1. **Face Detection**: Uses OpenCV's Haar Cascade Classifier to detect faces in the video feed.

2. **Face Recognition**: 
   - Implements a custom similarity-based approach
   - Uses normalized cross-correlation and structural similarity
   - Requires multiple consecutive matches for reliable recognition
   - Applies histogram equalization for better contrast

3. **Attendance System**:
   - Automatically marks attendance when a face is recognized
   - Stores records in CSV format with timestamp
   - Prevents duplicate entries in the same session

## Configuration

- Face detection parameters can be adjusted in `FaceDetector` class
- Recognition threshold is set to 0.65 by default
- Requires 2 consecutive matches for attendance marking
- Face images are standardized to 100x100 pixels

## Error Handling

The system includes comprehensive error handling for:
- Camera initialization failures
- Face detection issues
- Image saving/loading problems
- Recognition errors
- File system operations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- OpenCV for computer vision capabilities
- NumPy for numerical operations
- Tkinter for GUI components 
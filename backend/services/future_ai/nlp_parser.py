import re

class NLPCommandParser:
    """Rule-based command interpreter for natural language image processing commands."""

    OPERATION_MAP = {
        'sharpen': ['sharpen', 'sharp', 'enhance edges'],
        'blur': ['blur', 'soften', 'gaussian blur'],
        'edge_detection': ['edge', 'edges', 'detect edges', 'canny'],
        'object_detection': ['detect objects', 'find objects', 'yolo', 'object'],
        'ocr': ['extract text', 'read text', 'ocr', 'text recognition'],
        'remove_background': ['remove background', 'background removal', 'transparent background'],
        'grayscale': ['grayscale', 'black and white', 'convert to gray'],
        'rotate': ['rotate', 'turn'],
        'flip': ['flip', 'mirror'],
        'resize': ['resize', 'scale'],
        'brightness': ['brightness', 'brighten', 'darken'],
        'contrast': ['contrast', 'increase contrast', 'decrease contrast'],
        'metadata': ['metadata', 'info', 'details'],
        'enhance': ['enhance', 'improve quality', 'auto enhance'],
    }

    @classmethod
    def parse(cls, command: str):
        command = command.lower().strip()
        matched_ops = []
        for op, keywords in cls.OPERATION_MAP.items():
            for kw in keywords:
                if kw in command:
                    matched_ops.append((op, len(kw)))

        if not matched_ops:
            return {'operation': None, 'params': {}, 'confidence': 0.0}

        matched_ops.sort(key=lambda x: x[1], reverse=True)
        best_op = matched_ops[0][0]

        params = {}
        if best_op == 'rotate':
            match = re.search(r'(\d+)\s*(deg|degree|degrees?)', command)
            if match:
                params['angle'] = float(match.group(1))
            else:
                params['angle'] = 90
        elif best_op == 'resize':
            match = re.search(r'(\d+)\s*x\s*(\d+)', command)
            if match:
                params['width'] = int(match.group(1))
                params['height'] = int(match.group(2))
            else:
                match = re.search(r'(\d+)%', command)
                if match:
                    pct = float(match.group(1)) / 100.0
                    params['scale'] = pct
        elif best_op == 'brightness':
            match = re.search(r'([+-]?\d+)', command)
            if match:
                params['brightness'] = int(match.group(1))
            else:
                params['brightness'] = 20
        elif best_op == 'contrast':
            match = re.search(r'([0-9.]+)', command)
            if match:
                params['contrast'] = float(match.group(1))
            else:
                params['contrast'] = 1.5

        return {
            'operation': best_op,
            'params': params,
            'confidence': 1.0
        }


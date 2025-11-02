#!/usr/bin/env python3
"""
Simple script to create placeholder icons for the Chrome extension.
"""

try:
    from PIL import Image, ImageDraw, ImageFont

    def create_icon(size, filename):
        # Create a blue gradient background
        img = Image.new('RGB', (size, size), color='#2563eb')
        draw = ImageDraw.Draw(img)

        # Add a border
        border_width = max(1, size // 16)
        draw.rectangle(
            [border_width, border_width, size-border_width, size-border_width],
            outline='#1e40af',
            width=border_width
        )

        # Add "AI" text
        try:
            # Try to use a system font
            font_size = size // 2
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            # Fallback to default font
            font = ImageFont.load_default()

        text = "AI"

        # Get text bounding box for centering
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        position = ((size - text_width) // 2, (size - text_height) // 2 - size // 10)

        # Draw text with shadow
        shadow_offset = max(1, size // 32)
        draw.text((position[0] + shadow_offset, position[1] + shadow_offset), text, fill='#1e3a8a', font=font)
        draw.text(position, text, fill='white', font=font)

        img.save(filename, 'PNG')
        print(f"Created {filename}")

    # Create icons in different sizes
    import os
    os.makedirs('public/icons', exist_ok=True)

    sizes = [16, 32, 48, 128]
    for size in sizes:
        create_icon(size, f'public/icons/icon{size}.png')

    print("\n✓ All icons created successfully!")
    print("Run 'npm run build' to rebuild the extension with icons.")

except ImportError:
    print("Pillow library not found. Installing...")
    import subprocess
    subprocess.check_call(['pip3', 'install', 'Pillow'])
    print("\nPillow installed! Please run this script again:")
    print("python3 create_icons.py")

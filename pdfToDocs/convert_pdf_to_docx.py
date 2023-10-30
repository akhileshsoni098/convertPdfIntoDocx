import sys
import os
from pdf2docx import Converter

pdf_path = sys.argv[1]
output_path = os.path.splitext(pdf_path)[0] + '.doc'

pdf_converter = Converter(pdf_path)
pdf_converter.convert(output_path)
pdf_converter.close()

print('Conversion Completed')
